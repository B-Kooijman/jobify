using GraphQL;
using GraphQL.Language.AST;
using Sitecore;
using Sitecore.Abstractions;
using Sitecore.ContentSearch;
using Sitecore.ContentSearch.SearchTypes;
using Sitecore.Data.Items;
using Sitecore.Diagnostics;
using Sitecore.JavaScriptServices.Configuration;
using Sitecore.JavaScriptServices.GraphQL.Helpers;
using Sitecore.JavaScriptServices.GraphQL.LayoutService;
using Sitecore.LayoutService.Configuration;
using Sitecore.Mvc.Presentation;
using Sitecore.Services.GraphQL.Abstractions;
using Sitecore.Services.GraphQL.Hosting;
using Sitecore.Services.GraphQL.Hosting.Configuration;
using Sitecore.Services.GraphQL.Hosting.Performance;
using Sitecore.Services.GraphQL.Hosting.QueryTransformation;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace Jobify.Foundation.WildCardItemResolver.Pipelines
{

    public class LayoutServiceWildCardItemResolver : GraphQLAwareRenderingContentsResolver
    {
		private readonly IConfigurationResolver _configurationResolver;
		private readonly IDocumentWriter _documentWriter;
		private readonly BaseLog _log;
		private readonly IAsyncHelpers _asyncHelpers;
		private readonly Dictionary<string, IGraphQLEndpoint> _graphQLEndpoints;

		public LayoutServiceWildCardItemResolver(
            IConfigurationResolver configurationResolver, 
            IGraphQLEndpointManager graphQLEndpointManager, 
            IDocumentWriter documentWriter, 
            BaseLog log, 
            IAsyncHelpers asyncHelpers) : base(configurationResolver, graphQLEndpointManager, documentWriter, log, asyncHelpers)
        {
			this._configurationResolver = configurationResolver;
			this._documentWriter = documentWriter;
			this._log = log;
			this._asyncHelpers = asyncHelpers;
			this._graphQLEndpoints = graphQLEndpointManager.GetEndpoints().ToDictionary<IGraphQLEndpoint, string, IGraphQLEndpoint>(endpoint => endpoint.Url, endpoint => endpoint, StringComparer.OrdinalIgnoreCase);
		}

		public override object ResolveContents(Rendering rendering, IRenderingConfiguration renderingConfig)
		{
			RenderingItem renderingItem = rendering.RenderingItem;
			if (renderingItem == null)
			{
				return base.ResolveContents(rendering, renderingConfig);
			}
			string text = renderingItem.InnerItem[Sitecore.JavaScriptServices.Core.FieldIDs.JsonRendering.GraphQLQuery];
			if (string.IsNullOrWhiteSpace(text))
			{
				return base.ResolveContents(rendering, renderingConfig);
			}
			AppConfiguration appConfiguration = this._configurationResolver.ResolveForItem(Context.Item);
			if (appConfiguration == null)
			{
				this._log.Warn(string.Concat(new string[]
				{
					"[JSS] - Rendering ",
					renderingItem.InnerItem.Paths.FullPath,
					" defined a GraphQL query to resolve its data, but when rendered on item ",
					Context.Item.Paths.FullPath,
					" it was not within a known JSS app path. The GraphQL query will not be used."
				}), this);
				return base.ResolveContents(rendering, renderingConfig);
			}
			if (string.IsNullOrWhiteSpace(appConfiguration.GraphQLEndpoint))
			{
				this._log.Error(string.Concat(new string[]
				{
					"[JSS] - The JSS app ",
					appConfiguration.Name,
					" did not have a graphQLEndpoint set, but rendering ",
					renderingItem.InnerItem.Paths.FullPath,
					" defined a GraphQL query to resolve its data. The GraphQL query will not be used until an endpoint is defined on the app config."
				}), this);
				return base.ResolveContents(rendering, renderingConfig);
			}
			IGraphQLEndpoint graphQLEndpoint;
			if (!this._graphQLEndpoints.TryGetValue(appConfiguration.GraphQLEndpoint, out graphQLEndpoint))
			{
				this._log.Error(string.Concat(new string[]
				{
					"[JSS] - The JSS app ",
					appConfiguration.Name,
					" is set to use GraphQL endpoint ",
					appConfiguration.GraphQLEndpoint,
					", but no GraphQL endpoint was registered with this URL. GraphQL resolution will not be used."
				}), this);
				return base.ResolveContents(rendering, renderingConfig);
			}
			LocalGraphQLRequest request1 = new LocalGraphQLRequest();
			request1.Query = text;
			LocalGraphQLRequest localGraphQLRequest = request1;

			localGraphQLRequest.LocalVariables.Add("contextItem", Context.Item.ID.Guid.ToString());
			localGraphQLRequest.LocalVariables.Add("datasource", rendering.DataSource);
			localGraphQLRequest.LocalVariables.Add("language", Context.Language.Name);

			#region this is custom jobify code.
			if (Context.Item.Name == "*")
            {
				var requestedItemPath = Path.GetFileName(HttpContext.Current.Request.Path == "/sitecore/api/layout/render/jss"
					? HttpContext.Current.Request.QueryString["item"]
					: HttpContext.Current.Request.Path);

                if (!string.IsNullOrWhiteSpace(requestedItemPath))
				{
					var wildCardContextItem = GetContextItemByWildCard(requestedItemPath);
					if (wildCardContextItem != null)
					{
						localGraphQLRequest.LocalVariables.Add("wildCardContextItem", wildCardContextItem.ID.Guid.ToString());
					}
				}
			}
			#endregion

			IDocumentExecuter executor = graphQLEndpoint.CreateDocumentExecutor();
			ExecutionOptions options = graphQLEndpoint.CreateExecutionOptions(localGraphQLRequest, !HttpContext.Current.IsCustomErrorEnabled);
			if (options == null)
			{
				throw new ArgumentException("Endpoint returned null options.");
			}
			TransformationResult transformationResult = graphQLEndpoint.SchemaInfo.QueryTransformer.Transform(localGraphQLRequest);
			if (transformationResult.Errors != null)
			{
				ExecutionResult result1 = new ExecutionResult();
				result1.Errors = transformationResult.Errors;
				return result1;
			}
			options.Query = transformationResult.Document.OriginalQuery;
			options.Document = transformationResult.Document;
			if (options.Document.Operations.Any<Operation>(op => op.OperationType != OperationType.Query))
			{
				throw new InvalidOperationException("Cannot use mutations or subscriptions in a datasource query. Use queries only.");
			}
			object result;
			using (QueryTracer queryTracer = graphQLEndpoint.Performance.TrackQuery(localGraphQLRequest, options))
			{
				ExecutionResult executionResult = this._asyncHelpers.RunSyncWithThreadContext<ExecutionResult>(() => executor.ExecuteAsync(options));
				graphQLEndpoint.Performance.CollectMetrics(graphQLEndpoint.SchemaInfo.Schema, options.Document.Operations, executionResult);
				new QueryErrorLog(new BaseLogAdapter(this._log)).RecordQueryErrors(executionResult);
				queryTracer.Result = executionResult;
				result = this._documentWriter.ToJObject(executionResult);
			}
			return result;
		}

		public static Item GetContextItemByWildCard(string itemPath)
        {
            try
            {
                if (string.IsNullOrEmpty(itemPath))
                {
                    return null;
                }

                Item newContextItem = null;

                var itemPaths = itemPath.Split(new[] { "/" }, StringSplitOptions.RemoveEmptyEntries);
                var friendlyUrl = itemPaths.Last();
                if (string.IsNullOrEmpty(friendlyUrl))
                {
                    return null;
                }

                friendlyUrl = friendlyUrl.ToLower();
                var index = ContentSearchManager.GetIndex($"sitecore_{Context.Database.Name}_index");
                using (var context = index.CreateSearchContext())
                {
                    List<SearchResultItem> results = context.GetQueryable<SearchResultItem>()
                        .Where(i => i["friendlyurl"] == friendlyUrl).ToList();

                    if (results.Any())
                    {
                        newContextItem = results.First().GetItem();
                        return newContextItem;
                    }

                    return null;
                }
            }
            catch (Exception e)
            {
                Log.Error("An error occured on GetContextItemByWildCard", e.InnerException, nameof(WildCardItemResolver));
                return null;
            }
        }
    }
}

//public class LayoutServiceWildCardItemResolver : Sitecore.JavaScriptServices.ViewEngine.LayoutService.Pipelines.GetLayoutServiceContext.JssGetLayoutServiceContextProcessor
//{
//public LayoutServiceWildCardItemResolver(IConfigurationResolver configurationResolver) : base(configurationResolver)
//{
//}
//protected override void DoProcess(GetLayoutServiceContextArgs args, AppConfiguration application)
//{
//    args.ContextData.Add("securityInfo", new
//    {
//        isAnonymous = !Sitecore.Context.User.IsAuthenticated
//    });

//    if (Context.Item.Name != "*")
//    {
//        return;
//    }

//    var lastPart = Path.GetFileName(HttpContext.Current.Request.Path == "/sitecore/api/layout/render/jss"
//        ? HttpContext.Current.Request.QueryString["item"]
//        : HttpContext.Current.Request.Path);

//    var newContextItem = GetContextItemByWildCard(lastPart);

//    if (newContextItem != null)
//    {
//        args.ContextData.Add("wildcardContextItem", newContextItem.ID);
//    }

//    if (newContextItem != null)
//    {
//        Context.Item = newContextItem;
//        return;
//    }
//}