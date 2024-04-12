import { useEffect, useState } from 'react';
import useSWR from 'swr';
import {
  Button as HDSButton,
  IconPlus,
  Container,
} from 'hds-react';
import { useTranslation } from 'next-i18next';
import styles from './rssFeed.module.scss';
import dateformat from 'dateformat';
import { getRSSFeed } from '@/lib/client-api';

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
  const fetcher = (field_rss_feed_url: string) => getRSSFeed(field_rss_feed_url);
  const { data } = useSWR(field_rss_feed_url, fetcher);
  const [newsIndex, setNewsIndex] = useState<number>(4);
  const news = data?.items.slice(0, newsIndex);
  const bgColor = field_background_color?.field_css_name ?? 'white';
  const { t } = useTranslation();

  const getDateTimeFi = (published_at: string | null) => {
    const timestamp: any = published_at !== null && published_at;
    return dateformat(new Date(timestamp).getTime(), 'dd.mm.yyyy');
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
            { data?.items.length > news?.length && (
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
