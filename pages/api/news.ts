import type { NextApiRequest, NextApiResponse } from 'next'
import * as Elastic from '@/lib/elasticsearch';
import { SearchHit, SearchTotalHits } from '@elastic/elasticsearch/lib/api/types';

type Index = Partial<{ [key: string]: string | string[] }>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  interface Terms {
    terms: {
      field_article_category?: string[],
    } 
  }
  // No posts allowed, no missing params-errors revealed.
  if (req.method !== 'GET') {
    res.status(400)
    return
  }

  const { limit, filter, locale } : Index = req?.query

  const elastic = Elastic.getElasticClient();

  let response: any = {};
  const body = {
    size: limit as unknown as number,
    query: {
      bool: {
        filter: [] as Terms[],
      },
    },
  };

  const queryBody: Terms[] = body.query.bool.filter;

  if (filter) {
    const objectFilter = {
      terms: {
        field_article_category: [filter],
      },
    };
    queryBody.push(objectFilter as Terms);
  }

  try {
    const searchRes = await elastic.search({
      index: `articles_${locale}`,
      body: body,
      sort: 'published_at:desc'
    });

    const {
      hits: { total, hits },
    } = searchRes as {
      hits: { total: SearchTotalHits; hits: SearchHit<unknown>[] };
    };

    response = {
      ...response,
      total: total?.value,
      news: getNews(hits),
    };
  } catch (err) {
    console.log('err', err);
    res.status(500);
  }
  res.json(response);
  
}

const getNews = (hits: any) => {
  return hits
    .map((hit: any) => {
      const {
        title,
        field_article_category,
        published_at,
        created,
        url

      } = hit._source as any;
        return {
          title,
          field_article_category,
          published_at,
          created,
          url

        };
    })
};