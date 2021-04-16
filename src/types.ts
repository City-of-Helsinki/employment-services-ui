export type Lang = "fi" | "en" | "sv";
export type Params = { langParam: string; urlAlias: string };
export type EventParams = { urlAlias: string };
export type EventContent = {
  startTime: string;
  endTime: string;
};
export type CardType = "event" | "Card" | null;
// TODO type "any"
export type ParagraphData = {[k in Lang]: any};
export type UrlAliases = {[k in Lang]: string};
export interface SingleCardProps {
  text: string;
  title: string;
  type: CardType;
  lang: Lang;

  dateContent?: EventContent;
  location?: string;

  text_color?: string;
  title_color?: string;
  image?: string;
  button_url?: string;
  button_text?: string;
  button_bg_color?: string;
  bgColor?: string;
  bg_color?: string;
}

declare global {
  interface Window {
    rnsData: any;
    _paq: any;
  }
}
