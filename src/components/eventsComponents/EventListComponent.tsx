import { useTranslation } from 'next-i18next';
import Image from 'next/legacy/image';
import { Linkbox } from 'hds-react';

import styles from '../events/events.module.scss';
import TagList from '../events/TagList';
import DateTime from '../dateTime/DateTime';
import EventStatus from '../events/EventStatus';
import { EventData } from '@/lib/types';

function EventListComponent({ events }: { events: EventData[] }) {
    const { t } = useTranslation();
      return (
    <div className={styles.eventList}>
      {events && events.length > 0 ? (
        events.map((event: any, key: number) => (
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
                {event.field_event_tags && event.field_event_tags.length !== 0 && (
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
  );
}

export default EventListComponent;
