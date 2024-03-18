import { useEffect, useState } from 'react';

interface RSSFeedProps {
  field_rss_feed_url: string; 
}

function RSSFeed({ field_rss_feed_url }: RSSFeedProps) {
  const [feed, setFeed] = useState(null);

  console.log('data', field_rss_feed_url);
  

  useEffect(() => {
    if (field_rss_feed_url) {
      fetchRSSFeed(field_rss_feed_url);
    }
  }, [field_rss_feed_url]);

  const fetchRSSFeed = async (url: string) => {
    try {
      const encodedUrl = encodeURIComponent(url);
      const response = await fetch(`/api/rss-proxy?url=${encodedUrl}`);
    if(response.ok ) {
        const data = await response.json();
        setFeed(data);

        //remove!!!!!!
        console.log('data', data);
        
    } else {
        console.error('Error fetching feed:', response.statusText)
    }

    } catch (error) {
      console.error('Error fetching feed:', error);
    }
  };

  return (
    <div>
      {feed ? <p>Feed loaded</p> : <p>Loading feed...</p>}
    </div>
  );
}

export default RSSFeed;
