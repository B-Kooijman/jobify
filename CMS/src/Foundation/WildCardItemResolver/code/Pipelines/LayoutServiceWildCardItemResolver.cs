//using Sitecore.JavaScriptServices.Configuration;
//using Sitecore.JavaScriptServices.ViewEngine.LayoutService.Pipelines.GetLayoutServiceContext;
//using Sitecore.LayoutService.ItemRendering.Pipelines.GetLayoutServiceContext;
//using System.IO;
//using System.Web;

//namespace Jobify.Foundation.WildCardItemResolver.Pipelines
//{
//    public class LayoutServiceWildCardItemResolver : JssGetLayoutServiceContextProcessor
//    {
//        public SetWildcardContextItem(IConfigurationResolver configurationResolver) : base(configurationResolver)
//        {
//        }

//        protected override void DoProcess(GetLayoutServiceContextArgs args, AppConfiguration application)
//        {
//            if (Sitecore.Context.Item.Name != "*")
//            {
//                return;
//            }

//            var lastPart = Path.GetFileName(HttpContext.Current.Request.Path == "/sitecore/api/layout/render/jss"
//                ? HttpContext.Current.Request.QueryString["item"]
//                : HttpContext.Current.Request.Path);

//            var contextItem = WildcardUtility.FindItemByNameOrDisplayName(Sitecore.Context.Item, lastPart);

//            if (contextItem != null)
//            {
//                args.ContextData.Add("wildcardContextItem", contextItem.ID);
//            }
//        }
//    }
//}