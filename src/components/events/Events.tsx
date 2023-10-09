import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import useSWRInfinite from 'swr/infinite';
import { Button as HDSButton, IconCrossCircle, Container } from 'hds-react';

import { EventListProps } from '@/lib/types';
import { getEventsSearch, getEventsTags } from '@/lib/client-api';
import {
  eventTags,
  getEvents,
  getKey,
  getTotal,
  keepScrollPosition,
  getInitialFilters,
  getAvailableTags,
  handlePageURL,
} from '@/lib/helpers';
import styles from './events.module.scss';
import ButtonFilter from '../eventsComponents/ButtonFilter';
import EventListComponent from '../eventsComponents/EventListComponent';
import HtmlBlock from '../HtmlBlock';
import ResponsiveFilterMapper from '../eventsComponents/ResponsiveFilterMapper';

export default function Events(props: EventListProps): JSX.Element {
  const { field_title, field_events_list_desc } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const { locale, query } = router;
  const slug = query.slug as string[];
  const basePath =
    locale === 'fi'
      ? `${slug[0]}/${slug[1]}`
      : `${locale}/${slug[0]}/${slug[1]}`;

  const [filter, setFilter] = useState<string[]>(
    getInitialFilters('tag', locale ?? 'fi')
  );
  const [languageFilter, setLanguageFilter] = useState<string[]>(
    getInitialFilters('lang', locale ?? 'fi')
  );
  const fetcher = (eventsIndex: number) =>
    getEventsSearch(eventsIndex, filter, languageFilter, locale ?? 'fi');
  const { data, setSize } = useSWRInfinite(getKey, fetcher);
  const events = data && getEvents(data);
  const total = data && getTotal(data);
  const [eventsTags, setEventsTags] = useState<any>([]);
  const [eventsLanguageTags, setEventsLanguageTags] = useState<any>([]);

  const updateTags = useCallback(() => {
    getEventsTags('field_event_tags', locale ?? 'fi').then((result) => {
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

    getEventsTags('field_in_language', locale ?? 'fi').then((result) => {
      const languageTags = result.map(
        (tag: { key: string; doc_count: number }) => tag.key
      );
      setEventsLanguageTags(languageTags);
    });

    handlePageURL(filter, languageFilter, router, basePath);
  }, [locale, filter, languageFilter]);

  useEffect(() => {
    updateTags();
    setSize(1);
    const handleBeforeUnload = (): void => {
      if (filter !== null && filter !== undefined) {
        sessionStorage.setItem('tag', JSON.stringify(filter));
        sessionStorage.setItem('lang', JSON.stringify(languageFilter));
      }
      sessionStorage.setItem(
        'screenX',
        document.documentElement.scrollTop.toString()
      );
      sessionStorage.setItem('locale', locale ?? 'fi');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [filter, languageFilter, locale, setSize, updateTags]);

  const clearFilters = () => {
    setLanguageFilter([]);
    setFilter([]);
    router.replace(`/${basePath}`, undefined, { shallow: true });
  };

  const resultText = () => {
    return total &&
      (total.current < total.max || total.current === 0 || events?.length === 0)
      ? `${events.length} / ${total.max} ${t('list.results_text')}`
      : `${total?.max} ${t('list.results_text')}`;
  };

  const getInitialOptions = () => {
    const dropdownOptions: { label: string }[] = [];
    eventsLanguageTags.map((option: string) =>
      dropdownOptions.push({ label: option })
    );
    return dropdownOptions;
  };

  const getSelectedOptions = () : { label: string }[] => {
    const currentOptionSelected: { label: string }[] = [];
    const available = getAvailableTags(events, 'field_in_language');

    languageFilter.map((option: string) => {
      available.includes(option)
        ? currentOptionSelected.push({ label: option })
        : null;
    });
    return currentOptionSelected;
  };

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
          <ButtonFilter
            tags={eventsTags}
            events={events}
            setFilter={setFilter}
            filter={filter}
            filterField={'field_event_tags'}
            filterLabel={'search.filter'}
          />

          <ResponsiveFilterMapper
            setAvailableTags={filter.length > 0}
            events={events}
            setFilter={setLanguageFilter}
            selectedOptions={getSelectedOptions()}
            initialOptions={getInitialOptions()}
            tags={eventsLanguageTags}
            filter={languageFilter}
            filterField={'field_in_language'}
            filterLabel={'search.filter_lang'}
            dropdownLabel={'search.dropdown_label'}
          />

          <HDSButton
            variant="supplementary"
            iconLeft={<IconCrossCircle />}
            className={styles.supplementary}
            onClick={() => clearFilters()}
          >
            {t('search.clear')}
          </HDSButton>
          <div role="status" className={styles.results}>
            {resultText()}
          </div>
        </div>

        <EventListComponent events={events} />
      </Container>
    </div>
  );
}

