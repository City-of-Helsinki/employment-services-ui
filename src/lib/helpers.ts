import { DrupalMenuLinkContent } from 'next-drupal';
import { EventData, GroupingProps, Node } from '@/lib/types';
import getConfig from 'next/config';

import { BreadcrumbContent } from './types';
import { NODE_TYPES } from '@/lib/drupalApiTypes';
import { NextApiResponse } from 'next';


interface NewPage {
  id: string;
  title: string; 
  url: string;
  parent: string;
  locale: string;
}

export const eventTags = [
  'maahanmuuttajat',
  'nuoret',
  'info',
  'koulutus',
  'messut',
  'neuvonta',
  'rekrytointi',
  'työpajat',
  'digitaidot',
  'etätapahtuma',
  'palkkatuki',
  'työnhaku',
];
export const printablePages = [
  NODE_TYPES.ARTICLE,
  NODE_TYPES.EVENT,
  NODE_TYPES.PAGE,
  NODE_TYPES.TPR_UNIT,
];

export const primaryLanguages = ['fi', 'en', 'sv'];
export const frontPagePaths = [
  '/',
  '/en',
  '/sv',
  '/uk/frontpage',
  '/so/frontpage',
  '/ru/frontpage',
];

export const languageFrontPages = {
  fi: '/',
  en: '/en',
  sv: '/sv',
  uk: '/uk/frontpage',
  so: '/so/frontpage',
  ru: '/ru/frontpage',
};

/* Link and navigation helpers */
export const previewNavigation = (
  path: string,
  preview: boolean | undefined
): void => {
  if (preview) {
    window
      .open(`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/${path}`, '_parent')
      ?.focus();
  } else {
    return;
  }
};

export const isExternalLink = (href: string): boolean | undefined => {
  const isExternalLink =
    href && (href.startsWith('https://') || href.startsWith('http://'));

  return isExternalLink || false;
};

export const getImageUrl = (url: string): string => {
  if (!url) {
    return '';
  }

  const host = getConfig().publicRuntimeConfig.NEXT_IMAGE_DOMAIN;
  url = url.substring(url.indexOf('/sites'));

  return url ? `https://${host}${url}` : '';
};

export const getPath = (url: string): string => {
  const newUrl = new URL(url);

  return newUrl.pathname;
};

export const getPathAlias = (path: any): string => {
  if (!path) {
    return '';
  }

  return path.langcode === 'fi' ? path.alias : `/${path.langcode}${path.alias}`;
};

export const getBreadCrumb = (
  menuItems: DrupalMenuLinkContent[],
  path: string,
  title: string,
  type: string,
  locale: string
): BreadcrumbContent[] => {
  const mainMenuPage = menuItems.find(({ url }) => url === path);
  // Breadcrumb object for pages without menu attachment
  const newPage: NewPage = {
    id: 'current_page_crumb',
    title: title,
    url: path,
    parent: '',
    locale: locale,
  };
    // Read parent from the page path
    const parentPath = path.substring(0, path.lastIndexOf('/'));
    // Load parent menu object
    const parentPage = menuItems.find(({ url }) => url.includes(parentPath));
  
  // Pages that are not in menus always get a breadcrumb.
  if (!mainMenuPage) {
    // TPR Unit may not have menu attachment
    if (type === 'tpr_unit--tpr_unit') {
      return [];
    }

    if (
      type === 'node--page' ||
      !parentPage?.id ||
      (type === 'node--article' && !primaryLanguages.includes(locale))
    ) {
      return [newPage];
    }

    // Create parent id for the event
    newPage.parent = parentPage.id;
  }

  // Landing pages don't need breadcrumb.
  if (mainMenuPage?.parent === '') {
    return [];
  }
  // Create handle for the page object based on above
  const pageHandle: DrupalMenuLinkContent | NewPage | undefined =
    newPage.parent !== '' ? newPage : mainMenuPage;

  const breadcrumbs: BreadcrumbContent[] = [pageHandle as BreadcrumbContent];
  let parentItem = menuItems.find(({ id }) => id === pageHandle?.parent);

  if (parentItem) {
    breadcrumbs.push(parentItem);
    // This should always exit early and never infloop.
    for (let i = 0; i < menuItems.length; i++) {
      parentItem = menuItems.find(({ id }) => id === parentItem?.parent);
      if (parentItem) {
        breadcrumbs.push(parentItem);
      }
      if (!parentItem?.parent) break;
    }
  }

  return breadcrumbs.reverse();
};

/* Cookie helpers */
export const deleteCookie = (event: any, name: string, history: any) => {
  event.preventDefault();
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  history.go(0);
};

export const getCookiesUrl = (locale: string) => {
  let cookieUrl;
  switch (locale) {
    case 'fi':
      cookieUrl = '/cookies';
      break;
    case 'en':
    case 'sv':
      cookieUrl = `/${locale}/cookies`;
      break;
    default:
      cookieUrl = '/en/cookies';
  }
  return cookieUrl;
}; 

/** Get data from node helpers */
export const getTitle = (node: Node, suffix: String): string => {
  let pageTitle = node.title;

  if (node.type === 'tpr_unit--tpr_unit') {
    pageTitle = node.name_override ? node.name_override : node.name;
  }

  const title = node.field_metatags?.title
    ? node.field_metatags.title
    : pageTitle;
  return suffix ? `${title} | ${suffix}` : title;
};

export const getDescription = (node: Node): any => {
  if (node.field_metatags?.description) {
    return node.field_metatags.description;
  }

  switch (node.type) {
    case 'node--page':
      return node.field_lead_in;

    case 'node--landing_page':
      if (!node.field_hero?.field_hero_desc) {
        break;
      }
      return node.field_hero.field_hero_desc.processed.replace(
        /(<([^>]+)>)/gi,
        ''
      );

    case 'node--event':
      if (!node?.field_short_description) {
        break;
      }
      return node.field_short_description.processed.replace(
        /(<([^>]+)>)/gi,
        ''
      );

    case 'node--article':
      if (!node?.field_lead) {
        break;
      }
      return node.field_lead;

    case 'tpr_unit--tpr_unit':
      if (!node?.description) {
        break;
      }
      return node.description.value;

    default:
      break;
  }

  return '';
};

export const getDefaultImage = (node: Node): string => {
  switch (node.type) {
    case 'node--event':
      if (!node?.field_image_url) {
        break;
      }
      return node.field_image_url;

    case 'node--landing_page':
      if (!node?.field_hero) {
        break;
      }
      return node.field_hero.field_custom_hero_image?.field_media_image
        ?.image_style_uri?.['hero'];

    default:
      break;
  }

  return process.env.NEXT_PUBLIC_SITE_URL + '/tyollisyyspalvelut.png';
};

/** Filtering helpers */
export const sortArrayByOtherArray = (array: any[], sortArray: string[]) => {
  return [...array].sort(
    (a, b) =>
      sortArray.indexOf(a.name_override) - sortArray.indexOf(b.name_override)
  );
};

export const getLocale = (res: NextApiResponse<any>) => {
  const host = res.req.headers.host;
  const url = res.req.headers.referer
    ?.replace(`http://${host}/`, '')
    .slice(0, 2);
  const locale = url === 'en' || url === 'sv' ? url : 'fi';
  return locale;
};

export const groupData = (data: GroupingProps[]) => {
  const groups: string[] = [];
  data.forEach((item: GroupingProps) =>
    groups.indexOf(item.group) === -1 ? groups.push(item.group) : null
  );
  return groups;
};

export const setInitialLocale = (locale: string): string => {
  return primaryLanguages.includes(locale) ? locale : 'en';
};


/* event helper */

const urlParams =  typeof window !== 'undefined' ? new URLSearchParams(window.location.search): null;

export const getKey = (eventsIndex: number) => {
  return `${eventsIndex}`;
};

export const getEvents = (data: EventData[]) => {
  /** Filter events object from data */
  return data.reduce((acc: any, curr: any) => acc.concat(curr.events), []);
};

export const getTotal = (data: EventData[]) => {
  /** Filter total from data */
  return {
    max: data[0].maxTotal ? data[0].maxTotal : data[0].total,
    current: data[0].total,
  };
};

export const getSessionFilters = () => {
  if (typeof window !== 'undefined' && urlParams !== null) {
    if (urlParams.getAll('tag')) {
      return urlParams.getAll('tag');
    } else {
      return [];
    }
  } else {
    return [];
  }
};

export const getAvailableTag = (events: any) => {
  const availableTags: string[] = [];
  events
    ?.map((event: { field_event_tags: string[] }) => event?.field_event_tags)
    .forEach((field_event_tag: string[]) =>
      field_event_tag?.forEach((tag: string) =>
        !availableTags.includes(tag) ? availableTags.push(tag) : null
      )
    );
  return availableTags;
};

export const keepScrollPosition = () => {
  if (typeof window !== 'undefined' && urlParams !== null) {
    const screenX = sessionStorage.getItem('screenX');
    if (screenX !== null && urlParams.get('tag')) {
      const position = parseInt(screenX);
      window.scrollTo(0, position);
      sessionStorage.removeItem('screenX');
    } else {
      return;
    }
  }
};
