import type { NextApiRequest, NextApiResponse } from 'next'
import qs from "qs";

import * as Elastic from '@/lib/elasticsearch';
import { EventData, EventsQueryParams } from '@/lib/types'
import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

type Data = {
  name: string
}

interface Terms {
  terms: {
    field_event_tags?: string[],
    field_location_id?: string[],
  } 
}


export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const query: any = req?.query
  const queryParams: EventsQueryParams = qs.parse(query)

  let events: any = []
  // No posts allowed, no missing params-errors revealed.
  if (req.method !== 'GET') {
    res.status(400).json(events)
    return
  }
  const {tags, locationId, locale} = queryParams;
  
  const elastic = Elastic.getElasticClient();

  let response: any = {};
  const body = {
    size: locationId ? 2 : 3,
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
        langcode: [locale],
      },
    };
    queryBody.push(objectFilter as Terms);
  }

  if (tags) {
    const objectFilter = {
      terms: {
        field_event_tags: [tags],
      },
    };
    queryBody.push(objectFilter as Terms);
  }

  if (locationId) {
    const objectFilter = {
      terms: {
        field_location_id: [locationId],
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
      hits: { hits },
    } = searchRes as {
      hits: { hits: SearchHit<unknown>[] };
    };

    response = {
      events: getEvents(hits),
    };

  } catch (err) {
    console.log('err', err);
    res.status(500);
  }

  res.json(response);

}

const getEvents = (hits: any) => {
  return hits
    .map((hit: any) => {
      const {
        title,
        url,
        field_image_url,
        field_image_alt,
        field_start_time,
        field_end_time,
        field_location,
        field_location_id,
        field_tags,
        field_event_tags,
        field_street_address,
        field_event_status,
      } = hit._source as EventData;
        return {
          title,
          url,
          field_image_url,
          field_image_alt,
          field_start_time,
          field_end_time,
          field_location,
          field_location_id,
          field_tags,
          field_event_tags,
          field_street_address,
          field_event_status,
        };
    })
};
