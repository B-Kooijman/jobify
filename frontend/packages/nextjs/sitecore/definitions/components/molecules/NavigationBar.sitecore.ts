// eslint-disable-next-line no-unused-vars
import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-manifest';
import fs from 'fs';

const query = fs.readFileSync(
  'sitecore/definitions/components/molecules/NavigationBar.sitecore.graphql',
  'utf8'
);

/**
 * Adds the NavigationBar component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when 'jss manifest' is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function (manifest: Manifest): void {
  manifest.addComponent({
    name: 'NavigationBar',
    icon: SitecoreIcon.DocumentTag,
    graphQLQuery: query,
    fields: [
      { name: 'heading', type: CommonFieldTypes.SingleLineText },
      { name: 'menu', type: CommonFieldTypes.ContentList },
    ],
    /*
    If the component implementation uses <Placeholder> or withPlaceholder to expose a placeholder,
    register it here, or components added to that placeholder will not be returned by Sitecore:
    placeholders: ['exposed-placeholder-name']
    */
  });
}
