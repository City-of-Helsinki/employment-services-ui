import { DrupalJsonApiParams } from "drupal-jsonapi-params";
import { DrupalNode, getResource } from "next-drupal";
import { i18n } from "next-i18next.config";

export const isExternalLink = (href: string): boolean|undefined => {
  const isExternalLink = href && (href.startsWith("https://") || href.startsWith("https://"));
  return isExternalLink || false
};

export async function getLanguageLinks(node: DrupalNode): Promise<Object> {
  let params = new DrupalJsonApiParams().addFields(node.type, ['path']).getQueryObject()
  const uuid = node.id

  let langLinks = {};
  for (let locale of i18n.locales) {
    let prefix = locale !== i18n.defaultLocale ? `/${locale}` : ''
    let link = ''
    if(locale === node.langcode) {
      link = `${prefix}${node?.path.alias}` // current page link
    } else {
      // this has the original alias if not translated
      const response = await getResource(node.type, uuid, {params, locale, defaultLocale: i18n.defaultLocale})
      link = `${prefix}${response?.path.alias}`
    }
    Object.assign(langLinks, {[locale]: link})
  }

  return langLinks
}