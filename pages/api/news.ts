import type { NextApiRequest, NextApiResponse } from 'next'
import { getNews } from '@/lib/ssr-api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  let news: any = []
  // No posts allowed, no missing params-errors revealed.
  if (req.method !== 'GET') {
    res.status(400).json(news)
    return
  }

  const { limit, filter, locale }:any = req?.query

  news = await getNews(limit, filter, locale).catch((e) => {
    console.log('Error fetching news from Drupal: ', e)
    throw e
  })

  res
    .status(200)
    .json(news)
}
