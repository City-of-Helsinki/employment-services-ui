import { useEffect, useState } from 'react';
import {
  Button as HDSButton,
  IconPlus,
  Container,
} from 'hds-react';
import { useTranslation } from 'next-i18next';
import styles from './rssFeed.module.scss';
import dateformat from 'dateformat';

interface RSSFeedProps {
  field_rss_feed_url: string,
  field_background_color: {
    field_css_name: string;
  };
  field_rss_title: string,
}

interface News {
  id: string;
  isoDate?: string;
  link: string;
  title: string;
}

function RSSFeed({
  field_rss_feed_url,
  field_background_color,
  field_rss_title
}: RSSFeedProps): JSX.Element {
  const [feed, setFeed] = useState<any>([]);
  const [newsIndex, setNewsIndex] = useState<number>(4);
  const news = feed.length ? feed.slice(0, newsIndex) : [];
  const bgColor = field_background_color?.field_css_name ?? 'white';
  const { t } = useTranslation();

  useEffect(() => {
    if (field_rss_feed_url) {
      fetchRSSFeed(field_rss_feed_url);
    }
  }, []);

  const getDateTimeFi = (published_at: string | null) => {
    const timestamp: any = published_at !== null && published_at;
    return dateformat(new Date(timestamp).getTime(), 'dd.mm.yyyy');
  };

  const fetchRSSFeed = async (url: string) => {
    try {
      const encodedUrl = encodeURIComponent(url);
      const response = await fetch(`/api/rss-proxy?url=${encodedUrl}`);
      if (response.ok) {
          const data = await response.json();
          setFeed(data.items);

      } else {
          console.error('Error fetching feed:', response.statusText)
      }

    } catch (error) {
      console.error('Error fetching feed:', error);
    }
  };

  return (
    <>
      {news?.length ? (
        <div
          className="component"
          style={{ backgroundColor: `var(--color-${bgColor})` }}
        >
          <Container className="container">
            <div className={styles.newsListTitleArea}>
              {field_rss_title && <h2>{field_rss_title}</h2>}
            </div>
            <div
              className={`${styles.newsList} ${styles.short}`}
            >
              {news?.map((newsItem: News) => (
                <div className={styles.newsCard} key={newsItem.id}>
                  <a href={newsItem?.link}>
                    <h3 className={styles.newsTitle}>{newsItem?.title}</h3>
                  </a>
                  {newsItem.isoDate && (
                    <p className={styles.articleDate}>
                      <time
                        dateTime={getDateTimeFi(
                          newsItem.isoDate
                        )}
                      >
                        {getDateTimeFi(newsItem.isoDate)}
                      </time>
                    </p>
                  )}
                </div>
              ))}
            </div>
            { feed.length > news?.length && (
              <div className={styles.loadMore}>
                <HDSButton
                  variant="supplementary"
                  iconRight={<IconPlus />}
                  style={{ background: 'none' }}
                  onClick={() => {
                    setNewsIndex(newsIndex + 4);
                  }}
                >
                  {t('list.load_more')}
                </HDSButton>
              </div>
            )}
            </Container>
        </div>
      ) : null}
    </>
  );
}

export default RSSFeed;
