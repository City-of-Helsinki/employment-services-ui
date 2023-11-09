import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const { tagField, locale }: Partial<{ [key: string]: string | string[] }> =
      req?.query || {};

    if (!tagField) {
      throw new Error('Invalid or missing tagField parameter');
    }

    const localePath =
      locale === 'fi'
        ? `jsonapi/taxonomy_term/${tagField}`
        : `${locale}/jsonapi/taxonomy_term/${tagField}`;

    const apiUrl = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/${localePath}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${apiUrl}`);
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
