import type { NextApiRequest, NextApiResponse } from 'next';
import * as Elastic from '@/lib/elasticsearch';


interface QueryBody {
  query: {
    match_all: object,
  },
  size: number,
  aggs: {
    events_tags: {
      terms: {
        field: string,
        size: number,
      },
    },
  },
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { tagField, locale }: Partial<{ [key: string]: string | string[]; }> = req?.query || {};

  // No posts allowed, no missing params-errors revealed.
  if (req.method !== 'GET') {
    res.status(400);
    return;
  }
  const elastic = Elastic.getElasticClient();

  const body: QueryBody = {
    query: {
      match_all: {},
    },
    size: 0,
    aggs: {
      events_tags: {
        terms: {
          field: tagField as string,
          size: 100,
        },
      },
    },
  };

  try {
    const searchRes = await elastic.search({
      index: `events_${locale}`,
      body: body,
    });

    const { events_tags }: any = searchRes.aggregations;

    res.json(events_tags?.buckets);
  } catch (err) {
    console.log('err', err);
    res.status(500);
  }
}
