import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { tagField }: Partial<{ [key: string]: string | string[] }> =
    req?.query || {};

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/taxonomy_term/${tagField}`
  );
  const data = await response.json();

  res.status(200).json(data);
}
  
