import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import useSWRInfinite from 'swr/infinite';
import dateformat from 'dateformat';
import {
  Button as HDSButton,
  IconPlus,
  IconArrowRight,
  Container,
} from 'hds-react';


import { getNews } from '@/lib/client-api';
import { DrupalFormattedText } from '@/lib/types';
import HtmlBlock from '../HtmlBlock';
import styles from './news.module.scss';



interface NewsListProps {
  field_title: string;
  field_short_list: boolean;
  field_news_filter: string;
  field_news_list_desc: DrupalFormattedText;
  field_background_color: {
    field_css_name: string;
  };
}
interface News {
  id: string;
  published_at?: string;
  url: string;
  title: string;
  status: boolean;
  field_article_category: string;
  created: string;
}
const getKeyForNews = (index: number) => {
  return `${index}_news`;
};

function NewsList({
  field_title,
  field_short_list,
  field_news_list_desc,
  field_news_filter,
  field_background_color,
}: NewsListProps): JSX.Element {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [newsIndex, setNewsIndex] = useState<number>(4);
  const bgColor = field_background_color?.field_css_name ?? 'white';

  const fetcherForNews = (index: number) =>
    getNews(index, newsIndex, field_news_filter, locale ?? 'fi');

  const { data, size, setSize } = useSWRInfinite(getKeyForNews, fetcherForNews);
  const total = data && data[0].total;

  const news = data && data[0]?.news;

  useEffect(() => {
    setSize(1);
  }, [newsIndex]); // eslint-disable-line

  const getDateTimeFi = (published_at: string | null, created: string) => {
    const timestamp: any =
      published_at !== null && published_at > created ? published_at : created;
    return dateformat(new Date(timestamp * 1000), 'dd.mm.yyyy');
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
              {field_title && <h2>{field_title}</h2>}
              {field_short_list && t('list.news_url') && (
                <a href={t('list.news_url')}>
                  {t('list.show_all_news')} <IconArrowRight size="l" />
                </a>
              )}
            </div>
            {field_news_list_desc?.processed && (
              <div className={styles.newsListDescription}>
                <HtmlBlock field_text={field_news_list_desc} />
              </div>
            )}
            <div
              className={`${styles.newsList} ${
                field_short_list && styles.short
              }`}
            >
              {news?.map((news: News) => (
                <div className={styles.newsCard} key={news.id}>
                  <a href={news?.url[0]}>
                    <h3 className={styles.newsTitle}>{news?.title}</h3>
                  </a>
                  {news.field_article_category === 'newsletter' && (
                    <p>{t('news.newsletter')}</p>
                  )}
                  {news.published_at && (
                    <p className={styles.articleDate}>
                      <time
                        dateTime={getDateTimeFi(
                          news.published_at,
                          news.created
                        )}
                      >
                        {getDateTimeFi(news.published_at, news.created)}
                      </time>
                    </p>
                  )}
                </div>
              ))}
            </div>

            {!field_short_list && total > news?.length && (
              <div className={styles.loadMore}>
                <HDSButton
                  variant="supplementary"
                  iconRight={<IconPlus />}
                  style={{ background: 'none' }}
                  onClick={() => {
                    setNewsIndex(newsIndex + 4);
                    setSize(size + 1);
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

export default NewsList;
