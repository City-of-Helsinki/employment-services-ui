// Import rss-parser
import { NextApiRequest, NextApiResponse } from 'next';
import Parser from 'rss-parser';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const parser = new Parser();

  const { url } = req.query;

  // Validate the URL
  if (!url) {
    return res.status(400).json({ error: "URL parameter is required" });
  }

  try {
    const feed = await parser.parseURL(decodeURIComponent(url as string));
    res.status(200).json(feed);
  } catch (error) {
    console.error('RSS Feed Error:', error);
    res.status(500).json({ error: "Failed to fetch RSS feed" });
  }
};
