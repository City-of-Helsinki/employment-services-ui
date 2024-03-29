import type { NextApiRequest, NextApiResponse } from 'next'
import * as Elastic from '@/lib/elasticsearch'
import { SearchState, SearchData } from '@/lib/types'
import { SearchHit, SearchTotalHits, MsearchMultisearchBody, SearchRequest } from '@elastic/elasticsearch/lib/api/types'
import { Locale } from 'next-drupal'

type Data = SearchState

interface QueryParams {
  q: string
  locale: Locale
}

function pick_highlight(highlight: any) {
  const highlight_priority = ['field_search_keywords', 'title', 'field_title', 'field_lead_in', 'field_description'];
  for (const field of highlight_priority) {
    if (highlight.hasOwnProperty(field)) {
      return highlight[field];
    }
  }

  return Object.values(highlight)[0] // Return *_text
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  // No posts allowed, no missing params-errors revealed.
  if (req.method !== 'GET') {
    res.status(400)
    return  
  }

  const { q, locale }:QueryParams = req?.query as any
  const elastic = Elastic.getElasticClient()
  const size = 10
  const body: SearchRequest = {
    index: `*_${locale}`,
    size: size,
    query: {
      bool: {
        must: {
          multi_match: {
            query: q,
            type: "phrase_prefix",
            fields: [
              "field_search_keywords^8",
              "title^5",
              "*_title^3",
              "*_text",
              "field_lead_in^2",
              "field_description^2"
            ],
            operator: "and"
          }
        },
        must_not: {
          term: {
            field_hide_search: "true"
          }
        }
      }
    },
    highlight: {
      pre_tags: [""],
      post_tags: [""],
      number_of_fragments: 1,
      fragment_size: 10,
      boundary_scanner: "word",
      fields : {
        "field_search_keywords": { },
        "title": { },
        "*_title": { },
        "field_lead_in": { },
        "field_description": { },
        "*_text": { }
      }
    }
  }

  try {
    const searchRes = await elastic.search({
      ...body
    })

    const {
      hits: { total, hits }
    } = searchRes as { hits: { total: SearchTotalHits, hits: SearchHit<unknown>[] }}

    res.json({
      total: total?.value,
      results: hits.map((hit: any) => {
        const highlight = hit.highlight && pick_highlight(hit.highlight)

        return { highlight }
      }),
    })

  } catch (err) {
    console.log('err', err)
    res.status(500)
  }

}