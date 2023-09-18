import { getEventsLanguageTags, getEventsSearch, getEventsTags } from '@/lib/client-api';
import { EventData, EventListProps } from '@/lib/types';
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
import { eventTags } from '@/lib/helpers';
import { useCallback, useEffect, useState } from 'react';
import DateTime from '../dateTime/DateTime';

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

const getAvailableTag = (events: any) => {
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

export default function Events(props: EventListProps): JSX.Element {
  const { field_title, field_events_list_desc } = props;
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [filter, setFilter] = useState<string[]>([]);
  const [languageFilter, setLanguageFilter] = useState<string[]>([]);

  const fetcher = (eventsIndex: number) =>
    getEventsSearch(eventsIndex, filter, languageFilter, locale ?? 'fi');
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
  }, [locale]);

  const updateLanguageTags = useCallback(() => {
    getEventsLanguageTags(locale ?? 'fi').then((result) => {
      const languageTags = result.map((tag: { key: string; doc_count: number }) => tag.key)
      setEventsLanguageTags(languageTags);
    });
  }, [locale]);

  useEffect(() => {
    updateLanguageTags();
    updateTags();
    setSize(1);
  }, [filter, languageFilter, setSize, updateLanguageTags, updateTags]);

  return (
    <div className="component">
      <button onClick={() => updateLanguageTags()}>Languages</button>
      <Container className="container">
        {field_title && <h2>{field_title}</h2>}

        {field_events_list_desc?.processed && (
          <div className={styles.eventListDescription}>
            <HtmlBlock field_text={field_events_list_desc} />
          </div>
        )}

        <div role="group">
          <div className={styles.filter}>{t('search.filter')}</div>

          <div
            role="group"
            aria-label={t('search.group_description')}
            className={styles.filterTags}
          >
            {eventsTags?.map((tag: string, i: number) => (
              <HDSButton
                disabled={!getAvailableTag(events).includes(tag)}
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
              }}
            >
              {t('search.clear')}
            </HDSButton>
          </div>
          <div role="status" className={styles.results}>
            {resultText}
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
                      alt={event.field_image_alt ? event.field_image_alt[0] : ''}
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
