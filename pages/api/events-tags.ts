import type { NextApiRequest, NextApiResponse } from 'next';
import * as Elastic from '@/lib/elasticsearch';

type Data = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { locale }: any = req?.query ? req?.query : 'fi';

  // No posts allowed, no missing params-errors revealed.
  if (req.method !== 'GET') {
    res.status(400);
    return;
  }
  const elastic = Elastic.getElasticClient();

  const body: any = {
    query: {
      match_all: {},
    },
    size: 0,
    aggs: {
      events_tags: {
        terms: {
          field: 'field_event_tags.keyword',
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
