import { DrupalJsonApiParams } from "drupal-jsonapi-params";
import { DrupalMenuLinkContent, DrupalNode, getResource } from "next-drupal";
import getConfig from 'next/config'
import { i18n } from "next-i18next.config";
import { BreadcrumbContent } from "./types";

export const isExternalLink = (href: string): boolean|undefined => {
  const isExternalLink = href && (href.startsWith("https://") || href.startsWith("https://"));
  return isExternalLink || false
};

export const getImageUrl = (url: string): string => {
  const host = getConfig().publicRuntimeConfig.NEXT_PUBLIC_DRUPAL_BASE_URL
  url = url.substring(url.indexOf('/sites'))

  return url ? `${host}${url}` : ''
}

export async function getLanguageLinks(node: DrupalNode): Promise<Object> {
  let params = new DrupalJsonApiParams().addFields(node.type, ['path']).getQueryObject()
  const uuid = node.id

  let langLinks = {};
  for (let locale of i18n.locales) {
    let prefix = locale !== i18n.defaultLocale ? `/${locale}` : ''
    let link = ''
    if (locale === node.langcode) {
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

export const getBreadCrumb = (menuItems: DrupalMenuLinkContent[], path: string, title: string): BreadcrumbContent[] => {
  const page = menuItems.find(({ url }) => url === path)
  // Pages that are not in menus always get a breadcrumb.
  if (!page) {
    return [{ 
      id: 'current_page_crumb',
      title: title,
      url: path
    }]
  }
  // Landing pages don't need breadcrumb.
  if (page?.parent === '') {
    return []
  }
  const breadcrumbs: BreadcrumbContent[] = [page]
  let parentItem = menuItems.find(({ id }) => id === page?.parent)
  if (parentItem) {
    breadcrumbs.push(parentItem)
    // This should always exit early and never infloop.
    for (let i=0; i < menuItems.length; i++) {
      parentItem = menuItems.find(({ id }) => id === parentItem?.parent)
      if (parentItem) {
        breadcrumbs.push(parentItem)
      }
      if (!parentItem?.parent) break;
    }
  }
  return breadcrumbs.reverse()
}
