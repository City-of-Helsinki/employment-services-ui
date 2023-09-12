import type { NextApiRequest, NextApiResponse } from 'next';
import { getRelatedEvents } from '@/lib/ssr-api';
import qs from 'qs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query: Partial<{
    [key: string]: string | string[];
  }> = req?.query;

  const queryParams: any = qs.parse(query as string | Record<string, string>);
  const events = await getRelatedEvents(queryParams).catch((e) => {
    console.log('Error fetching events from Drupal: ', e);
    throw e;
  });

  // No posts allowed, no missing params-errors revealed.
  if (req.method !== 'GET') {
    res.status(400).json(events);
    return;
  }

  res.status(200).json(events);
}
