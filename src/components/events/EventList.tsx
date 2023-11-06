import useSWR from 'swr';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Image from 'next/legacy/image';
import { Linkbox, IconArrowRight, Container } from 'hds-react';

import { EventsQueryParams, EventListProps, EventData } from '@/lib/types';
import { getEvents } from '@/lib/client-api';

import { getPathAlias } from '@/lib/helpers';
import HtmlBlock from '@/components/HtmlBlock';
import TagList from './TagList';
import styles from './events.module.scss';
import EventStatus from './EventStatus';
import DateTime from '../dateTime/DateTime';

export function EventList({
  pageType,
  locationId,
  ...props
}: EventListProps): JSX.Element {
  const {
    field_title,
    field_events_list_short,
    field_event_tag_filter: tags,
    field_background_color,
    field_events_list_desc,
  } = props;
  const bgColor = field_background_color?.field_css_name ?? 'white';
  const { t } = useTranslation();
  const { locale, asPath } = useRouter();
  const queryParams: EventsQueryParams = {
    tags: tags,
    locationId: pageType === 'tpr_unit' ? locationId : null,
    locale: locale ?? 'fi',
  };
  
  const fetcher = () => getEvents(queryParams);
  const { data } = useSWR(`/${locale}/${asPath}`, fetcher);

  return (
    <div
      className="component hide-print"
      style={{ backgroundColor: `var(--color-${bgColor})` }}
    >
      <Container className="container">
        <div className={styles.eventListTitleArea}>
          {field_title && <h2>{field_title}</h2>}
          {field_events_list_short && t('list.events_page_url') && (
            <a href={t('list.events_page_url')}>
              {t('list.show_all_events')} <IconArrowRight size="l" />
            </a>
          )}
        </div>

        {field_events_list_desc?.processed && (
          <div className={styles.eventListDescription}>
            <HtmlBlock field_text={field_events_list_desc} />
          </div>
        )}
        <div
          className={`${styles.eventList} ${
            field_events_list_short && styles.short
          }`}
        >
          {data?.events?.length
            ? data?.events?.map((event: EventData) => (
              
                <div
                  className={`${styles.eventCard} event-card`}
                  key={event.id}
                >
                  <Linkbox
                    className={styles.linkBox}
                    linkboxAriaLabel={`${t('list.event_title')} ${event.title}`}
                    linkAriaLabel={`${t('list.event_link')} ${event.title}`}
                    key={event.id}
                    href={getPathAlias(event.path)}
                    // withBorder
                  >
                    {event.field_image_url && (
                      <Image
                        src={event.field_image_url[0]}
                        alt={event.field_image_alt[0] ?? ''}
                        layout="responsive"
                        objectFit="cover"
                        width={3}
                        height={2}
                      />
                    )}                    
                    <div className={styles.eventCardContent}>
                      {event.field_event_tags &&
                        event.field_event_tags.length !== 0 && (
                          <TagList
                            tags={event.field_event_tags.map(
                              (tag: any) => tag
                            )}
                          />
                        )}
                      <DateTime
                        startTime={event.field_start_time}
                        endTime={event.field_end_time}
                      />
                      <h3>
                        <EventStatus {...event} />
                        {event.title}
                      </h3>
                      <p>
                        {event.field_location}
                        {event.field_street_address
                          ? `, ${event.field_street_address}`
                          : ''}
                      </p>
                    </div>
                  </Linkbox>
                </div>
              ))
            : t('list.no_events')}
        </div>
      </Container>
    </div>
  );
}
