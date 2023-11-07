import {
  DrupalNode,
  Locale,
  DrupalMenuLinkContent,
} from 'next-drupal'
import { MouseEventHandler } from 'react';

export interface Node extends DrupalNode {
  title: string;
  field_hero?: {
    field_hero_desc: DrupalFormattedText;
    field_custom_hero_image: any;
  };
  field_lead_in?: string;
  field_content: any;
  field_notification: any;
  field_lower_content: any;
  field_hide_sidebar: boolean;
  name: string;
  name_override: string;
  description: DrupalFormattedText;
  phone: any;
  address: any;
  address_postal: string;
  opening_hours: any;
  picture_url: string;
  picture_url_override: any;
  drupal_internal__id: string;
  field_hide_navigation: boolean;
  langcode: string;
  field_article_category: string;
}

type TextFormats = 'basic_html' | 'restricted_html' | 'plain_text'
export interface DrupalFormattedText {
  format: TextFormats
  processed: string
  value: string
}

export interface NavProps {
  locale?: Locale;
  menu?: DrupalMenuLinkContent[];
  themes?: DrupalMenuLinkContent[];
  langLinks?: any;
  breadcrumb?: any;
  hideNav?: boolean;
  langcode?: string;
  menuOtherLanguages?: DrupalMenuLinkContent[];
  preview?: boolean;
}

export interface FooterProps {
  locale: Locale
  footerNav?: DrupalMenuLinkContent[]
}

export interface BreadcrumbContent {
  id: string;
  title: string;
  url: string;
  locale?: string;
}

export interface Tags {
  [key: string]: string | string[]
}

export interface EventsQueryParams {
  tags?: string | string[],
  locationId?: string | null
  locale?: Locale
}

export interface EventsRelatedQueryParams {
  locale?: Locale;
  superEvent: string;
  nodeId: string;
}

export interface EventData {
  id: string;
  title: string;
  url: string;
  field_image_url: string;
  field_image_alt: string;
  field_start_time: number;
  field_end_time: number;
  field_event_status: string;
  field_location: string;
  field_location_id?: string;
  field_tags: string[];
  field_event_tags: string[];
  field_street_address?: string;
  path: {
    alias: string;
    langcode: string;
    pid: number;
  }
}

export interface TprUnitData extends DrupalNode {
  name: string;
  name_override: string;
  description: DrupalFormattedText;
  field_content: any;
  field_lower_content: any;
  phone: any;
  address: any;
  address_postal: string;
  opening_hours: any;
  picture_url: string;
  picture_url_override: any;
  drupal_internal__id: string;
}

export interface EventState {
  total: number
  events: EventData[]
}

export interface EventData  {
  events: EventData[];
  tags: string[];
  total: number;
  maxTotal?: number;
  field_in_language: string;
  field_language_id: string;
  status: boolean;
  langcode: string[];
}

export interface EventListProps {
  pageType?: string
  field_title: string
  field_events_list_short: boolean
  field_event_tag_filter: string[]
  field_background_color: {
    field_css_name: string
  } | null
  field_events_list_desc:  DrupalFormattedText
  locationId: string | null
  field_street_address: string
  field_event_tags: string[]
}

export interface SearchState {
  total: number
  results: SearchData[]
}

export interface SearchData {
  entity_type: string
  type: string
  title: string
  field_lead_in: string
  field_description: string
  field_start_time: number
  field_end_time: number
  changed: number
  url: string
}

export type SearchInputValue = string | undefined

declare global {
  interface Window {
    _paq: any
    rnsData: any
  }
}

export interface GroupingProps {
  group: string
  value: string
}

export interface NavigationProps {
  locale: string | undefined;
  onSearch: (searchValue: string) => void;
  hideNav: boolean | undefined;
  menu?: DrupalMenuLinkContent[];
  activePath: string;
  langLinks: LangLinks;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  langcode: string;
  onSignIn?: (() => void);
  menuOtherLanguages?: DrupalMenuLinkContent[];
  preview?: boolean;
}

export interface LanguageSelect {
  langLinks: LangLinks;
  activePath: string;
  langcode: string | undefined;
  menuOtherLanguages?: DrupalMenuLinkContent[];
  preview: boolean | undefined;
}
interface LangLinks {
  en: string;
  fi: string;
  sv: string;
  ua: string;
  ru: string;
  so: string;
}
