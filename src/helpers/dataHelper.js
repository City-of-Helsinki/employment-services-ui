import { find } from 'lodash';
import getColor from "./colorHelper";
import { getEventsListTitle, getNewsListTitle, getBlogListTitle } from "../config";

export const findImageUrl = (uuid, files, media, imageStyle) => {
  if (!files || !files.data || !media || !media.data) {
    return "";
  }
  const mIndex = media.data.data.findIndex(item => item.id === uuid);
  const imageUid = media.data.data[mIndex].relationships.field_media_image.data.id;
  const fIndex = files.data.data.findIndex(item => item.id === imageUid);
  
  return files.data.data[fIndex].attributes.image_style_uri.filter(imgStyle => imgStyle[imageStyle])[0][imageStyle];
}

export const findImageAlt = (item, field, files, media) => {
  if (!files || !files.data || !media || !media.data || !item.relationships[field].data) {
    return '';
  }
  const mIndex = media.data.data.findIndex(i => i.id === item.relationships[field].data.id);
  const imgAlt = media.data.data[mIndex].relationships.field_media_image.data.meta.alt || '';

  return imgAlt;
}

export const findImage = (item, field, files, media, imageStyle) => {
  try {
    return findImageUrl(item.relationships[field].data.id, files, media, imageStyle);
  } catch (error) {
    // console.log('no pic: ' + field);
  }
  return null;
}

export const findPdfUrl = (uid, files, pdfs) => {
  if (!files || !files.data || !pdfs || !pdfs.data) {
    return "";
  }
  const pIndex = pdfs.data.data.findIndex(item => item.id === uid);

  const pdfUid = pdfs.data.data[pIndex].relationships.field_media_document.data.id;
  const fIndex = files.data.data.findIndex(item => item.id === pdfUid);
  return files.data.data[fIndex].attributes.uri.url;
}

const getTextValue = (path) => {
  if (!path || !path.value) {
    return "";
  }
  return path.value;
}

const getCards = (dataIncluded, ids) => {
  const cards = [];
  ids.map((item, index) => {
    const { id } = item;
    const card = find(dataIncluded, { id });
    card.thisCardIsInList = true;
    cards.push(card);
    return cards;
  });
  return cards;
}

const convertCardsFromDrupal = (drupalCards, includeFromList, files, media, taxonomies) => {
  const cards = [];
  try {
    drupalCards.map((item, index) => {
      if ((includeFromList && item.thisCardIsInList) ||
        (!includeFromList && !item.thisCardIsInList)
      ) {
        cards.push({
          type: 'Card',
          lang: item.attributes.langcode,
          bgColor: getColor(item, 'field_background_color', taxonomies),
          title: item.attributes.field_card_title,
          title_color: getColor(item, 'field_title_color', taxonomies),
          text: getTextValue(item.attributes.field_card_text),
          text_color: getColor(item, 'field_text_color', taxonomies),
          buttonText: item.attributes.field_card_button_text,
          url: item.attributes.field_card_button_url,
          width: item.attributes.field_card_width,
          height: item.attributes.field_card_height,
          image: findImage(item, 'field_ic_image', files, media, 'wide_s'),
          buttonBgColor: getColor(item, 'field_button_color', taxonomies),
          alt: findImageAlt(item, 'field_ic_image', files, media)
        });
      }
      return cards;
    });
  } catch (error) {
    console.log("card converts");
    console.log(error);
  }

  return cards;
}

export const findEventData = (lang, json) => {
  if (!json.data || !json.data[0] || !json.data[0].type || !json.data[0].attributes) {
    console.log('error with event data, no data');
    return [];
  }
  const attributes = json.data[0].attributes;

  const infoUrl = attributes.field_info_url;
  const infoUrlText = infoUrl && infoUrl.startsWith("https://teams.microsoft") ? "Avaa Teams-tapahtuma" : "Tapahtuman kotisivut";
  const paragraphs = [{
    type: 'Subheading',
    lang,
    title: attributes.field_title,
    title_color: "",
    text: '',
  },
  {
    type: 'Date',
    lang,
    startTime: attributes.field_start_time,
    endTime: attributes.field_end_time,
  },
  {
    type: 'Location',
    lang,
    location: "Internet",
  },
  {
    type: 'Text',
    lang,
    title: '',
    text: attributes.field_text.value,
  }]
  if (infoUrl) {
    paragraphs.push(
      {
        type: 'Link',
        url: infoUrl,
        url_text: infoUrlText,
      }
    )
  }

  paragraphs.push({
    type: 'ShareButtons',
    lang,
    bgColor: '#fff',
  })

  paragraphs.push({
    type: 'EventsList',
    lang,
    title: getEventsListTitle(lang),
    text: '',
    bgColor: '#f1f1f1',
  })

  paragraphs.push({
    type: 'ReactAndShare',
    lang,
    title: '',
    text: '',
    bgColor: '#fff',
  })

  return paragraphs;
}

export const findNodeAttributes = (json) => {
  const data = {
    created: json.data[0].attributes.created,
    summary: json.data[0].attributes.field_summary,
    title: json.data[0].attributes.title,
  };

  return data
}

export const findPageData = (lang, json, files, media, doc, taxonomies) => {
  const data = [];
  
  if (!json.included) {
    console.log('error with data, no json.included');
    return data;
  }

  const pageType = json.data[0].type;

  json.included.map((item, index) => {
    switch (item.type) {
      case 'paragraph--accordion':
        try {
          data.push({
            type: 'Accordion',
            lang: item.attributes.langcode,
            title: item.attributes.field_accordion_title,
            text: getTextValue(item.attributes.field_accordion_text),
          });
        } catch (error) {
          console.log("accordion");
          console.log(error);
        }
        break;
      case 'paragraph--card': {
        const cards = convertCardsFromDrupal([item], false, files, media, taxonomies);
        if (cards.length > 0) {
          data.push(cards[0]);
        }
        break;
      }
      case 'paragraph--card_list':
        try {
          const drupalCards = getCards(json.included, item.relationships.field_cards.data);
          const cards = convertCardsFromDrupal(drupalCards, true, files, media, taxonomies);
          data.push({
            type: 'CardList',
            lang: item.attributes.langcode,
            title: item.attributes.field_card_list_title,
            cards,
            bgColor: getColor(item, 'field_card_list_bg_color', taxonomies),
            isKoro: item.attributes.field_card_list_is_koro,
          });
        } catch (error) {
          console.log("card-list");
          console.log(error);
        }
        break;
      case 'paragraph--hero':
        try {
          data.push({
            type: 'Hero',
            lang: item.attributes.langcode,
            title: item.attributes.field_hero_title,
            text: getTextValue(item.attributes.field_hero_text),
            imageUrl: item.attributes.field_shallow ? findImage(item, 'field_hero_image', files, media, 'hero_shallow') : findImage(item, 'field_hero_image', files, media, 'hero'),
            shallow: item.attributes.field_shallow
          });
        } catch (error) {
          console.log("hero");
          console.log(error);
        }
        break;
      case 'paragraph--info':
        try {
          data.push({
            type: 'Info',
            lang: item.attributes.langcode,
            title: item.attributes.field_info_title,
            text: getTextValue(item.attributes.field_info_text),
          });
        } catch (error) {
          console.log("info");
          console.log(error);
        }
        break;
      case 'paragraph--image_and_card':
        try {
          const drupalCards = getCards(json.included, item.relationships.field_ic_card.data);
          const cards = convertCardsFromDrupal(drupalCards, true, files, media, taxonomies);
          const imageUrl = findImage(item, 'field_ic_image', files, media, 'regular_s');
          const alt = findImageAlt(item, 'field_ic_image', files, media)

          data.push({
            type: 'ImageAndCard',
            lang: item.attributes.langcode,
            card: cards[0],
            imageUrl,
            alt,
          });
        } catch (error) {
          console.log("image and card");
          console.log(error);
        }
        break;
      case 'paragraph--image':
        try {
          data.push({
            type: 'Image',
            lang: item.attributes.langcode,
            title: '',
            text: '',
            alt: findImageAlt(item, 'field_image_image', files, media),
            imageUrl: findImage(item, 'field_image_image', files, media, 'wide_s'),
            height: item.attributes.field_image_height,
            caption: item.attributes.field_caption,
          });
        } catch (error) {
          console.log("image");
          console.log(error);
        }
        break;
      case 'paragraph--video':
        try {
          data.push({
            type: 'Video',
            lang: item.attributes.langcode,
            videoUrl: item.attributes.field_video_url,
          });
        } catch (error) {
          console.log("video");
          console.log(error);
        }
        break;
      case 'paragraph--link_internal':
        try {
          const pdfUrl = findPdfUrl(item.relationships.field_media_document.data.id, files, doc);
          data.push({
            type: 'Pdf',
            lang,
            title: item.attributes.field_doc_title,
            text: '',
            url: pdfUrl,
          });
        } catch (error) {
          console.log("pdf");
          console.log(error);
        }
        break;
      case 'paragraph--mainheading':
        try {
          data.push({
            type: 'Mainheading',
            lang: item.attributes.langcode,
            title: item.attributes.field_title,
            titleColor: getColor(item, 'field_title_color', taxonomies),
            text: '',
            showDate: item.attributes.field_show_date, 
          });
        } catch (error) {
          console.log("mainheading");
          console.log(error);
        }
        break;
      case 'paragraph--subheading':
        try {
          data.push({
            type: 'Subheading',
            lang: item.attributes.langcode,
            title: item.attributes.field_subheading_title,
            titleColor: getColor(item, 'field_title_color', taxonomies),
            text: '',
          });
        } catch (error) {
          console.log("subheading");
          console.log(error);
        }
        break;
      case 'paragraph--lead':
        try {
          data.push({
            type: 'Lead',
            lang: item.attributes.langcode,
            text: item.attributes.field_lead_text,
          });
        } catch (error) {
          console.log("lead");
          console.log(error);
        }
        break;
      case 'paragraph--highlighted_text':
          try {
            data.push({
              type: 'HighlightedText',
              lang: item.attributes.langcode,
              text: item.attributes.field_highlighted_text,
            });
          } catch (error) {
            console.log("highlighted text");
            console.log(error);
          }
          break;
      case 'paragraph--text':
        try {
          data.push({
            type: 'Text',
            lang: item.attributes.langcode,
            text: getTextValue(item.attributes.field_text_demo),
          });
        } catch (error) {
          console.log("text");
          console.log(error);
        }
        break;
      case 'paragraph--phone_number_box':
        try {
          data.push({
            type: 'PhoneNumberBox',
            lang: item.attributes.langcode,
            title: item.attributes.field_pb_title,
            text: getTextValue(item.attributes.field_pb_text),
          });
        } catch (error) {
          console.log("text");
          console.log(error);
        }
        break;
      case 'paragraph--events_list':
        try {
          data.push({
            type: 'EventsList',
            lang: item.attributes.langcode,
            title: item.attributes.field_title,
            text: '',
            bgColor: getColor(item, 'field_background_color', taxonomies),
          })
        } catch (error) {
          console.log('events-list');
          console.log(error);
        }
        break;
      case 'paragraph--news_list':
        try {
          data.push({
            type: 'NewsList',
            lang: item.attributes.langcode,
            title: item.attributes.field_title,
            text: '',
            bgColor: getColor(item, 'field_background_color', taxonomies),
            isKoro: item.attributes.field_koro,
            titleColor: "#fd4f00",
            limit: item.attributes.field_short_list,
          })
        } catch (error) {
          console.log('news-list');
          console.log(error);
        }
        break;
      case 'paragraph--blog_list':
        try {
          data.push({
            type: 'BlogList',
            lang: item.attributes.langcode,
            title: item.attributes.field_title,
            text: '',
            bgColor: getColor(item, 'field_background_color', taxonomies),
            isKoro: item.attributes.field_koro,
            titleColor: "#fd4f00",
            limit: item.attributes.field_short_list,
          })
        } catch (error) {
          console.log('blog-list');
          console.log(error);
        }
        break;
      case 'paragraph--link':
        try {
          data.push({
            type: 'Link',
            lang: item.attributes.langcode,
            url_text: item.attributes.field_url_text,
            url: item.attributes.field_url,
          })
        } catch (error) {
          console.log('link');
          console.log(error);
        }
        break;
      case 'paragraph--sujo_embedded':
        try {
          data.push(
            {
              type: 'SujoEmbedded',
              training: item.attributes.field_training,
            }
          )
        } catch (error) {
          console.log('sujo');
          console.log(error);
        }
        console.log('item', item);
        break;
      case 'taxonomy_term--paragraph_width':
        break;
      default:
        data.push({
          type: 'Unid',
          drupalType: item.type,
          lang: item.attributes.langcode,
        });
      }
    return data;
  });

  if (pageType !== 'node--landing') {
    data.push({
      type: 'ShareButtons',
      lang,
      bgColor: '#fff',
    });
  }

  if (pageType === 'node--news') {
    data.push({
      type: 'NewsList',
      lang,
      title: getNewsListTitle(lang),
      text: '',
      bgColor: '#f1f1f1',
      isKoro: true,
      titleColor: "#1a1a1a",
      limit: false,
    })
  }

  if (pageType === 'node--blog') {
    data.push({
      type: 'BlogList',
      lang,
      title: getBlogListTitle(lang),
      text: '',
      bgColor: '#f1f1f1',
      isKoro: true,
      titleColor: "#1a1a1a",
      limit: false,
    })
  }

  data.push({
    type: 'ReactAndShare',
    lang,
    bgColor: '#fff',
  });

  return data;
}

export const getUrlAlias = (data) => {
  if (!data || !data.data || !data.data.data[0] || !data.data.data[0].attributes || !data.data.data[0].attributes.path || !data.data.data[0].attributes.path.alias) {
    return null;
  }
  return data.data.data[0].attributes.path.alias.substring(1);
}

