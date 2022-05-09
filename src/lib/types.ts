import {
  DrupalNode,
  Locale,
  DrupalMenuLinkContent,
} from 'next-drupal'

export interface Node extends DrupalNode {
  title: string;
  field_lead_in: string;
  field_content: any;
}

type TextFormats = 'basic_html' | 'restricted_html' | 'plain_text';
export interface DrupalFormattedText {
  format: TextFormats;
  processed: string;
  value: string;
}

export interface HeaderProps {
  locale: Locale;
  menu?: DrupalMenuLinkContent[];
  themes?: DrupalMenuLinkContent[];
  langLinks?: any;
};
