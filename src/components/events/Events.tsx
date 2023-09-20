<<<<<<< HEAD
import { getEventsLanguageTags, getEventsSearch, getEventsTags } from '@/lib/client-api';
import { EventData, EventListProps } from '@/lib/types';
=======
import { useCallback, useEffect, useState } from 'react';
import { getEventsSearch, getEventsTags } from '@/lib/client-api';
import { EventListProps } from '@/lib/types';
>>>>>>> d444ce136 (THF-610: refactor code and remove storage memory form tags)
import {
  Linkbox,
  Button as HDSButton,
  IconCrossCircle,
  Container,
} from 'hds-react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import useSWRInfinite from 'swr/infinite';
import HtmlBlock from '../HtmlBlock';
import Image from 'next/legacy/image';

import styles from './events.module.scss';

import TagList from './TagList';
import EventStatus from './EventStatus';
import {
  eventTags,
  getAvailableTag,
  getEvents,
  getKey,
  getTotal,
  keepScrollPosition,
  getSessionFilters,
} from '@/lib/helpers';
import DateTime from '../dateTime/DateTime';

<<<<<<< HEAD
const getKey = (eventsIndex: number) => {
  return `${eventsIndex}`;
};

const getEvents = (data: EventData[]) => {
  /** Filter events object from data */
  return data.reduce((acc: any, curr: any) => acc.concat(curr.events), []);
};

const getTotal = (data: EventData[]) => {
  /** Filter total from data */
  return {
    max: data[0].maxTotal ? data[0].maxTotal : data[0].total,
    current: data[0].total,
  };
};

const getSessionFilters = (locale: string) => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.getAll('field_tag')) {
      return urlParams.getAll('field_tag')
    } else {
      const sessionFilters = sessionStorage.getItem('sessionFilter');
      const sessionLocale = sessionStorage.getItem('locale');
      if (sessionFilters !== null && sessionLocale === locale) {
        return JSON.parse(sessionFilters);
      } else {
        return [];
      }
    }
  }
}

const getAvailableTags = (events: any) => {
  const availableTags: string[] = [];
  events
    ?.map((event: { field_event_tags: string[] }) => event?.field_event_tags)
    .forEach((field_event_tag: string[]) =>
      field_event_tag?.forEach((tag: string) =>
        !availableTags.includes(tag) ? availableTags.push(tag) : null
      )
    );
  return availableTags;
};

const keepScrollPosition = () => {
  const screenX = sessionStorage.getItem('screenX');
  if (screenX !== null) {
    const position = parseInt(screenX);
    setTimeout(() => window.scrollTo(0, position), 0);
    sessionStorage.removeItem('screenX');
  }
};

=======
>>>>>>> d444ce136 (THF-610: refactor code and remove storage memory form tags)
export default function Events(props: EventListProps): JSX.Element {
  const { field_title, field_events_list_desc } = props;
  const { t } = useTranslation();
<<<<<<< HEAD
  const { locale } = useRouter();
  const [filter, setFilter] = useState<string[]>([]);
  const [languageFilter, setLanguageFilter] = useState<string[]>([]);
=======
  const router = useRouter();
  const { locale, query } = router;
  const slug = query.slug as string[];
  const basePath =
    locale === 'fi'
      ? `${slug[0]}/${slug[1]}`
      : `${locale}/${slug[0]}/${slug[1]}`;

  const [filter, setFilter] = useState<string[]>(
    getSessionFilters()
  );
  const fetcher = (eventsIndex: number) => {
    return getEventsSearch(eventsIndex, filter, locale ?? 'fi');
  };
<<<<<<< HEAD
>>>>>>> a815e8dd3 (THF-610: add url parameters)

  const fetcher = (eventsIndex: number) => {    
   return getEventsSearch(eventsIndex, filter, languageFilter, locale ?? 'fi');
  }
 
=======
>>>>>>> d444ce136 (THF-610: refactor code and remove storage memory form tags)
  const { data, setSize } = useSWRInfinite(getKey, fetcher);
  const events = data && getEvents(data);
  const total = data && getTotal(data);
  const [eventsTags, setEventsTags] = useState<any>([]);
  const [eventsLanguageTags, setEventsLanguageTags] = useState<any>([]);

  const resultText =
    total &&
    (total.current < total.max || total.current === 0 || events?.length === 0)
      ? `${events.length} / ${total.max} ${t('list.results_text')}`
      : `${total?.max} ${t('list.results_text')}`;

  const updateTags = useCallback(() => {
    getEventsTags(locale ?? 'fi').then((result) => {
      const tags: string[] = result
        .filter((item: { key: string; doc_count: number }) => {
          return item.key === undefined ? false : item;
        })
        .map((item: { key: string; doc_count: number }) => {
          return item.key;
        })
        .sort(
          (a: string, b: string) => eventTags.indexOf(a) - eventTags.indexOf(b)
        );
      setEventsTags(tags);
    });

    if (filter.length) {
      const tags = filter.map((tag) =>
        tag === filter[0] ? `tag=${tag}` : `&tag=${tag}`
      );
      router.replace(
        `/${basePath}?${tags.toString().replaceAll(',', '')}`,
        undefined,
        { shallow: true }
      );
    }
  }, [locale, filter]);


  const updateLanguageTags = useCallback(() => {
    getEventsLanguageTags(locale ?? 'fi').then((result) => {
      const languageTags = result.map((tag: { key: string; doc_count: number }) => tag.key)
      setEventsLanguageTags(languageTags);
    });
  }, [locale]);

  useEffect(() => {  
     const sessionFilters = sessionStorage.getItem('sessionFilter');
     if (sessionFilters !== null) {
       setFilter(JSON.parse(sessionFilters));
     }
 },[])
 
   useEffect(() => {
     updateLanguageTags();
    updateTags();
    setSize(1);
    const handleBeforeUnload = (): void => {
      sessionStorage.setItem(
        'screenX',
        document.documentElement.scrollTop.toString()
      );
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

     return () => {
       window.removeEventListener('beforeunload', handleBeforeUnload);
     };
   }, [filter, languageFilter, setSize, updateLanguageTags, updateTags]);

  return (
    <div className="component" onLoad={() => keepScrollPosition()}>
      <Container className="container">
        {field_title && <h2>{field_title}</h2>}

        {field_events_list_desc?.processed && (
          <div className={styles.eventListDescription}>
            <HtmlBlock field_text={field_events_list_desc} />
          </div>
        )}
        <div role="group">
          <h2>{t('search.header')}</h2>
          <div className={styles.filter}>{t('search.filter')}</div>
          <div
            role="group"
            aria-label={t('search.group_description')}
            className={styles.filterTags}
          >
            {eventsTags?.map((tag: string, i: number) => (
              <HDSButton
                disabled={!getAvailableTags(events, 'field_event_tags').includes(tag)}
                role="checkbox"
                aria-checked={filter.includes(tag)}
                aria-label={`${t('search.filter')} ${tag.replace('_', ' ')}`}
                key={`tagFilter-${i}`}
                className={
                  filter.includes(tag) ? styles.selected : styles.filterTag
                }
                onClick={() =>
                  setFilter((current) =>
                    current?.includes(tag)
                      ? [...current].filter(function (item) {
                          return item !== tag;
                        })
                      : [...current, tag]
                  )
                }
              >
                {tag.replace('_', ' ')}
              </HDSButton>
            ))}
            <HDSButton
              variant="supplementary"
              iconLeft={<IconCrossCircle />}
              className={styles.supplementary}
              onClick={() => {
                setFilter([]);
                router.replace(`/${basePath}`, undefined, { shallow: true });
              }}
            >
              {t('search.clear')}
            </HDSButton>
          </div>
        </div>
        <div role="group">
          <div className={styles.filter}>{t('search.filter')}</div>

          <div
            role="group"
            aria-label={t('search.group_description')}
            className={styles.filterTags}
          >
            {eventsLanguageTags?.map((tag: string, i: number) => (
              <HDSButton
                disabled={!getAvailableTags(events, 'field_in_language').includes(tag)}
                role="checkbox"
                aria-checked={filter.includes(tag)}
                aria-label={`${t('search.filter')} ${tag.replace('_', ' ')}`}
                key={`tagLanguage-${i}`}
                className={
                  languageFilter.includes(tag) ? styles.selected : styles.filterTag
                }
                onClick={() =>
                  setLanguageFilter((current) =>
                    current?.includes(tag)
                      ? [...current].filter(function (item) {
                          return item !== tag;
                        })
                      : [...current, tag]
                  )
                }
              >
                {tag.replace('_', ' ')}
              </HDSButton>
            ))}
            <HDSButton
              variant="supplementary"
              iconLeft={<IconCrossCircle />}
              className={styles.supplementary}
              onClick={() => {
                setLanguageFilter([]);
              }}
            >
              {t('search.clear')}
            </HDSButton>
          </div>
          <div role="status" className={styles.results}>
            {resultText}
          </div>
        </div>
        <div className={styles.eventList}>
          {events && events.length > 0 ? (
            events.map((event: any, key: any) => (
              <div className={styles.eventCard} key={key}>
                <Linkbox
                  className={styles.linkBox}
                  linkboxAriaLabel={`${t('list.event_title')} ${event.title}`}
                  linkAriaLabel={`${t('list.event_link')} ${event.title}`}
                  key={key}
                  href={event.url}
                  withBorder
                >
                  {event.field_image_url && (
                    <Image
                      src={event.field_image_url[0]}
                      alt={
                        event.field_image_alt ? event.field_image_alt[0] : ''
                      }
                      layout="responsive"
                      objectFit="cover"
                      width={3}
                      height={2}
                    />
                  )}

                  <div className={styles.eventCardContent}>
                    {event.field_tags && event.field_tags.length !== 0 && (
                      <TagList tags={event.field_event_tags} />
                    )}
                    <DateTime
                      startTime={event.field_start_time[0]}
                      endTime={event.field_end_time[0]}
                    />
                    <h3>
                      <EventStatus {...event} />
                      {event.title[0]}
                    </h3>
                    <p>
                      {event.field_location[0]}
                      {event.field_street_address
                        ? `, ${event.field_street_address[0]}`
                        : ''}
                    </p>
                  </div>
                </Linkbox>
              </div>
            ))
          ) : (
            <p>{t('list.result_zero')}</p>
          )}
        </div>
      </Container>
    </div>
  );
}
