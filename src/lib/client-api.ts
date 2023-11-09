import axios from 'axios';
import qs from 'qs';

import { EventsQueryParams, EventsRelatedQueryParams } from '@/lib/types';
import { Locale } from 'next-drupal';

/** The Client API urls  */
const EVENTS_URL = '/api/events';
const EVENTS_SEARCH_URL = '/api/events-search';
const EVENTS_TAGS_URL = '/api/events-tags';
const RELATED_EVENTS = '/api/related-events'
const NEWS_URL = '/api/news';
const UNITS_URL = '/api/units';
const SEARCH_URL = '/api/search';
const SEARCH_SUGGEST_URL = '/api/search-suggest';

export const getEvents = async (queryParams: EventsQueryParams) => {

  const { data } = await axios(`${EVENTS_URL}`, {
    params:
      queryParams,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
  })
  return data;
};

export const getEventsSearch = async (
  eventsIndex: number,
  eventTags: [{name: string, id: string}],
  languageTag: [{name: string, id: string}],
  locale: Locale
) => {

  const queryParams = {
    index: eventsIndex,
    eventTagId: eventTags.map((tag: {id: string}) => tag.id),
    eventTagName: eventTags.map((tag: {name: string}) => tag.name),
    languageTagId: languageTag.map((tag: {id: string}) => tag.id),
    locale: locale,
  };

  const { data } = await axios(`${EVENTS_SEARCH_URL}`, {
    params: queryParams,
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    },
  });

  return data;
};

export const getRelatedEvents = async (queryParams: EventsRelatedQueryParams) => {
  const { data } = await axios(`${RELATED_EVENTS}`, {
    params:
      queryParams,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
  })
  return data;
};

export const getNews = async (index: number, shortList: any, newsFilter: string, locale: Locale) => {
  const queryParams = { index: index, limit: shortList, filter: newsFilter, locale: locale };
    const { data } = await axios(`${NEWS_URL}`, {
      params:
        queryParams,
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
    return data;
};

export const getUnits = async (locale: Locale) => {
  const { data } = await axios(`${UNITS_URL}`, { params: { locale: locale } });
  return data;
};

export const getSearch = async (
  index: number,
  query: string | undefined,
  locale: Locale
) => {
  const { data } = await axios(`${SEARCH_URL}`, {
    params: { index: index, q: query, locale: locale },
  });
  return data;
};

export const getEventsTags = async (tagField: string, locale: string ) => {
  const { data } = await axios(`${EVENTS_TAGS_URL}`, {
    params: { tagField: tagField, locale: locale},
  }); 
  return data;
};


export const getSearchSuggestions = async (
  query: string | undefined,
  locale: Locale
) => {
  const { data } = await axios(`${SEARCH_SUGGEST_URL}`, {
    params: { q: query, locale: locale },
  });
  return data;
};
