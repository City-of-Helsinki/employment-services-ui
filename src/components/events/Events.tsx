import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import useSWRInfinite from 'swr/infinite';
import { Button as HDSButton, IconCrossCircle, Container } from 'hds-react';

import { EventListProps } from '@/lib/types';
import { getEventsSearch, getEventsTags } from '@/lib/client-api';
import {
  getTotal,
  keepScrollPosition,
  getInitialFilters,
  handlePageURL,
  getContent,
  getAvailableTags,
  drupalLanguages,
} from '@/lib/helpers';

import styles from './events.module.scss';
import ButtonFilter from '../eventsComponents/ButtonFilter';
import EventListComponent from '../eventsComponents/EventListComponent';
import HtmlBlock from '../HtmlBlock';
import ResponsiveFilterMapper from '../eventsComponents/ResponsiveFilterMapper';

const getKeyForEvent = (index: number) => {
  return `${index}`;
};

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

  const [languageFilter, setLanguageFilter] = useState<any>(
    getInitialFilters('lang', locale ?? 'fi')
  );
  const [filter, setFilter] = useState<any>(
    getInitialFilters('tag', locale ?? 'fi')
  );

  const fetcherForEvents = (eventsIndex: number) =>
    getEventsSearch(
      eventsIndex,
      filter as [{ id: string; name: string }],
      languageFilter as any,
      locale ?? 'fi'
    );
  const { data, setSize } = useSWRInfinite(getKeyForEvent, fetcherForEvents);
  const events = data && getContent('events', data);
  const total = data && getTotal(data);
  const [eventsTags, setEventsTags] = useState<any>([]);
  const [eventsLanguageTags, setEventsLanguageTags] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const languagesResponse = await getEventsTags('event_languages', 'fi');
        const languagesData = await languagesResponse.data;
        const updatedTerms = languagesData
          .map((term: any) => term.attributes)
          .map((tag: any) => ({
            id: tag.field_language_id,
            name: tag.field_display_name || tag.name,
          }));
        setEventsLanguageTags(updatedTerms);

        const tagsResponses = await Promise.all(
          drupalLanguages.map(async (lang) => {
            try {
              const response = await getEventsTags('event_tags', lang);
              return response.data;
            } catch (error) {
              console.error(`Error fetching data for language ${lang}:`, error);
              return [];
            }
          })
        );

        const tagsData = tagsResponses
          .flat()
          .map((response) => response.attributes);

        const groupedTags: {
          [id: string]: {
            id: string;
            name_en: string;
            name_fi: string;
            name_sv: string;
            name_so: string;
            name_ua: string;
            name_ru: string;
          };
        } = {};

        tagsData.forEach(
          (tag: {
            langcode: string;
            name: string;
            field_id: string;
            id: string;
          }) => {
            const id = tag.field_id;
            if (!groupedTags[id]) {
              groupedTags[id] = {
                id,
                name_en: tag.langcode === 'en' ? tag.name : '',
                name_fi: tag.langcode === 'fi' ? tag.name : '',
                name_sv: tag.langcode === 'sv' ? tag.name : '',
                name_so: tag.langcode === 'so' ? tag.name : '',
                name_ua: tag.langcode === 'ua' ? tag.name : '',
                name_ru: tag.langcode === 'ru' ? tag.name : '',
              };
            } else {
              (groupedTags[id] as any)[`name_${tag.langcode}`] = tag.name;
            }
          }
        );
        const resultArray = Object.values(groupedTags);
        setEventsTags(resultArray);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [locale]);

  useEffect(() => {
    if (eventsTags && eventsTags.length > 0) {
      const tagEvent = isFirstElementString(filter)
        ? eventsTags.filter((tag: any) => filter.includes(tag.name_en))
        : [...filter];
      setFilter(tagEvent);
    }
    if (eventsLanguageTags && eventsLanguageTags.length > 0) {
      const tagEvent = isFirstElementString(languageFilter)
        ? eventsLanguageTags.filter((tag: any) =>
            languageFilter.includes(tag.id)
          )
        : [...languageFilter];
      setLanguageFilter(tagEvent);
    }
  }, [eventsTags, eventsLanguageTags]);

  const isFirstElementString = (array: any) => {
    return array !== null && array !== undefined && typeof array[0] === 'string'
      ? true
      : false;
  };

  const updateURL = useCallback(() => {
    handlePageURL(
      filter as [{ id: string; name_en: string }],
      languageFilter as any,
      router,
      basePath
    );
  }, [locale, filter, languageFilter]);

  useEffect(() => {
    updateURL();
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
  }, [filter, languageFilter, locale, setSize, updateURL]);

  const clearFilters = () => {
    setFilter([]);
    setLanguageFilter([]);
    router.replace(`/${basePath}`, undefined, { shallow: true });
  };

  const resultText = () => {
    return total &&
      (total.current < total.max || total.current === 0 || events?.length === 0)
      ? `${events.length} / ${total.max} ${t('list.results_text')}`
      : `${total?.max} ${t('list.results_text')}`;
  };

  const getInitialOptions = () => {
    const dropdownOptions: { value: string; label: string }[] = [];

    eventsLanguageTags.map((option: { id: string; name: string }) =>
      dropdownOptions.push({ value: option.id, label: option.name })
    );
    return dropdownOptions;
  };

  return (
    <div onLoad={() => keepScrollPosition()}>
      <Container className="container">
        {field_title && <h2>{field_title}</h2>}

        {field_events_list_desc?.processed && (
          <div className={styles.eventListDescription}>
            <HtmlBlock field_text={field_events_list_desc} />
          </div>
        )}
        <div role="group">
          <h2>{t('search.header')}</h2>

          <ResponsiveFilterMapper
            tags={eventsLanguageTags}
            setFilter={setLanguageFilter}
            filter={languageFilter}
            availableTags={getAvailableTags(events, 'field_language_id')}
            filterLabel={'search.filter_lang'}
            setAvailableTags={filter.length > 0}
            dropdownLabel={'search.dropdown_label'}
            initialOptions={getInitialOptions()}
          />

          <ButtonFilter
            tags={eventsTags}
            setFilter={setFilter}
            filter={filter as any}
            availableTags={getAvailableTags(events, 'field_event_tags_id')}
            filterLabel={'search.filter'}
            language={
              languageFilter.length > 0 &&
              drupalLanguages.includes(languageFilter[0].id)
                ? languageFilter[0].id
                : locale
            }
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
