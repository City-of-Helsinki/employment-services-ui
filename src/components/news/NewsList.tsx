import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import {
  Button as HDSButton,
  IconPlus,
  IconArrowRight,
  Container,
} from 'hds-react';
import dateformat from 'dateformat';
import useSWR from 'swr';

import { DrupalFormattedText, Node } from '@/lib/types';
import { getPathAlias } from '@/lib/helpers';
import { getNews } from '@/lib/client-api';
import HtmlBlock from '@/components/HtmlBlock';
import styles from './news.module.scss';

interface NewsListProps {
  field_title: string;
  field_short_list: boolean;
  field_news_filter: string;
  field_news_list_desc: DrupalFormattedText;
  langcode: string;
  field_background_color: {
    field_css_name: string;
  };
}
interface News {
  id: string;
  published_at?: string;
  path: Path;
  title: string;
  status: boolean;
  field_article_category: string;
}

interface Path {
  alias: string;
  langcode: string;
  pid: number;
}

function NewsList({
  field_title,
  field_short_list,
  field_news_list_desc,
  field_news_filter,
  langcode,
  field_background_color,
}: NewsListProps): JSX.Element {
  const { t } = useTranslation();
  const [newsIndex, setNewsIndex] = useState<number>(1);
  const [paginatedNews, setPaginatedNews] = useState<Node[]>([]);
  const bgColor = field_background_color?.field_css_name ?? 'white';
  const fetcher = () => getNews(field_short_list, field_news_filter, langcode);
  const { data: news } = useSWR(`/news`, fetcher);

  const total: number = news?.length ?? 0;
  useEffect(() => {
      const paginatedArticle = news?.slice(0, 4 * newsIndex);
      setPaginatedNews(paginatedArticle);
  }, [news, newsIndex]);

  const loadMoreText = t('list.load_more');
  return (
    <div
      className="component"
      style={{ backgroundColor: `var(--color-${bgColor})` }}
    >
      <Container className="container">
        <div className={styles.newsListTitleArea}>
          {field_title && <h2>{field_title}</h2>}
          {field_short_list && (
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
          className={`${styles.newsList} ${field_short_list && styles.short}`}
        >
          {paginatedNews?.map((news: News) => (
            <div className={styles.newsCard} key={news.id}>
              <a href={getPathAlias(news.path)}>
                <h3 className={styles.newsTitle}>{news.title}</h3>
              </a>
              {news.field_article_category === 'newsletter' && (
                <p>{t('news.newsletter')}</p>
              )}
              {news.published_at && (
                <p className={styles.articleDate}>
                  <time dateTime={news.published_at}>{`${dateformat(
                    news.published_at,
                    'dd.mm.yyyy'
                  )}`}</time>
                </p>
              )}
            </div>
          ))}
        </div>

        {!field_short_list && paginatedNews && total > paginatedNews.length && (
          <div className={styles.loadMore}>
            <HDSButton
              variant="supplementary"
              iconRight={<IconPlus />}
              style={{ background: 'none' }}
              onClick={() => {
                setNewsIndex(newsIndex + 1);
              }}
            >
              {loadMoreText}
            </HDSButton>
          </div>
        )}
      </Container>
    </div>
  );
}

export default NewsList;
