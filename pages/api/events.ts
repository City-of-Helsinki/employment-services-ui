import type { NextApiRequest, NextApiResponse } from 'next'
import * as Elastic from '@/lib/elasticsearch';
// import { getEvents } from '@/lib/ssr-api'
import { EventData, EventsQueryParams } from '@/lib/types'
import qs from "qs";
import { SearchHit, SearchTotalHits } from '@elastic/elasticsearch/lib/api/types';

type Data = {
  name: string
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

  const elastic = Elastic.getElasticClient();

  let response: any = {};
  const body = {
    size: 3,
    query: { match_all: {} },
  };

const locale ='fi';

  try {
    const searchRes = await elastic.search({
      index: `events_${locale ?? 'fi'}`,
      body: body,
      sort: 'field_end_time:asc',
    });

    const {
      hits: { total, hits },
    } = searchRes as {
      hits: { total: SearchTotalHits; hits: SearchHit<unknown>[] };
    };

    response = {
      events: getEvents(hits),
    };

  } catch (err) {
    console.log('err', err);
    res.status(500);
  }

  // events = await getEvents(queryParams).catch((e) => {
  //   console.log('Error fetching events from Drupal: ', e)
  //   throw e
  // })

  console.log('response ', response);
  
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
