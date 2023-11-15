import type { NextApiRequest, NextApiResponse } from 'next';
import {
  SearchHit,
  SearchTotalHits,
} from '@elastic/elasticsearch/lib/api/types';

import * as Elastic from '@/lib/elasticsearch';
import { EventState, EventData } from '@/lib/types';
import { drupalLanguages } from '@/lib/helpers';

type Data = EventState;
type Index = Partial<{ [key: string]: string | string[] }>;

interface Terms {
  terms: {
    field_event_tags_id?: string[];
    langcode?: string[];
    field_language_id?: string[];
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // No posts allowed, no missing params-errors revealed.
  if (req.method !== 'GET') {
    res.status(400);
    return;
  }

  const { index, eventTagId, languageTagId, locale }: Index =
    req?.query || {};

  if (isNaN(Number(index))) {
    res.status(400);
    return;
  }

  const elastic = Elastic.getElasticClient();

  let response: any = {};
  const body = {
    size: 200,
    query: {
      bool: {
        filter: [] as Terms[],
      },
    },
  };

  const queryBody: Terms[] = body.query.bool.filter;

  if (locale) {
    const objectFilter = {
      terms: {
        langcode: getLanguage(languageTagId as string, locale as string),
      },
    };
    queryBody.push(objectFilter as Terms);
  }

  if (eventTagId) {
    const objectFilter = {
      terms: {
        field_event_tags_id: getQueryFilterTags(eventTagId),
      },
    };
    queryBody.push(objectFilter as Terms);
  }

  if (languageTagId) {
    const objectFilter = {
      terms: {
        field_language_id: [languageTagId],
      },
    };
    queryBody.push(objectFilter as Terms);
  }

  try {
    const searchRes = await elastic.search({
      index: `event_index`,
      body: body,
      sort: 'field_end_time:asc',
    });

    const {
      hits: { total, hits },
    } = searchRes as {
      hits: { total: SearchTotalHits; hits: SearchHit<unknown>[] };
    };

    response = {
      ...response,
      total: total?.value,
      events: getFilteredEvents(getFilterTags(eventTagId), hits),
    };
  } catch (err) {
    console.log('err', err);
    res.status(500);
  }

  if (languageTagId) {
    try {
      const searchRes = await elastic.search({
        index: `event_index`,
        body: {
          query: {
            match: {
              langcode: String(
                getLanguage(languageTagId as string, locale as string)
              ),
            },
          },
        },
      });
      const {
        hits: { total, hits },
      } = searchRes as {
        hits: { total: SearchTotalHits, hits: any };
      };

      response = {
        ...response,
        maxTotal: total?.value,
      };
    } catch (err) {
      console.log('err', err);
      res.status(500);
    }
  }
    res.json(response);
}

const getLanguage = (languageTagId: string, locale: string) => {
 return drupalLanguages.includes(languageTagId as string) && languageTagId !== undefined
    ? [languageTagId]
    : [locale];
};

const getFilterTags = (
  filter: string | string[] | undefined
): string[] | undefined => {
  if (filter === undefined) {
    return undefined;
  } else if (Array.isArray(filter)) {
    return filter;
  } else {
    return [String(filter)];
  }
};

const getQueryFilterTags = (
  filter: string | string[] | undefined
): string[] => {
  if (filter === undefined) {
    return [];
  } else if (Array.isArray(filter)) {
    return filter;
  } else {
    return [String(filter)];
  }
};

const getFilteredEvents = (filterTags: string[] | undefined, hits: any) => {
  return hits
    .map((hit: any) => {
      const {
        title,
        url,
        field_event_tags,
        field_event_tags_id,
        field_in_language,
        field_language_id,
        field_image_url,
        field_image_alt,
        field_start_time,
        field_end_time,
        field_location,
        field_tags,
        field_street_address,
        field_event_status,
        langcode,
      } = hit._source as EventData;
      if (
        filterTags === undefined ||
        filterTags?.length <= 1 ||
        (filterTags !== undefined &&
          filterTags?.length > 1 &&
          filterTags?.every((tag) =>
            hit._source.field_event_tags_id.includes(tag)
          ))
      ) {
        return {
          title,
          url,
          field_event_tags,
          field_event_tags_id,
          field_in_language,
          field_language_id,
          field_image_url,
          field_image_alt,
          field_start_time,
          field_end_time,
          field_location,
          field_tags,
          field_street_address,
          field_event_status,
          langcode,
        };
      } else {
        return;
      }
    })
    .filter((event: EventData) => event !== null && event !== undefined);
};
