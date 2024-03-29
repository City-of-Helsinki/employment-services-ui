import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useSWR from 'swr';
import {
  Button,
  Container,
  IconAngleDown,
  IconAngleUp,
  IconArrowRight,
  IconCalendarPlus,
} from 'hds-react';

import { EventData, EventsRelatedQueryParams } from '@/lib/types';
import { getRelatedEvents } from '@/lib/client-api';
import DateTimeSimple from '../dateTime/DateTimeSimple';
import styles from './events.module.scss';
import SideContent from '../sideContent/SideContent';

interface DateTimeProps {
  superEvent: string;
  nodeId: string;
}

export default function RelatedEvents(
  props: DateTimeProps
): JSX.Element | null {
  const { locale, asPath } = useRouter();
  const queryParams: EventsRelatedQueryParams = {
    superEvent: props.superEvent,
    nodeId: props.nodeId,
    locale: locale,
  };
  const fetcher = () => getRelatedEvents(queryParams);
  const { data: events } = useSWR(`/${locale}/${asPath}`, fetcher);
  const { t } = useTranslation();

  const [showAll, setShowAll] = useState<boolean>(false);
  const [eventData, setEventData] = useState<EventData[]>(events);

  useEffect(() => {
    showAll ? setEventData(events) : setEventData(events?.slice(0, 3));
  }, [events, showAll]);

  if (events?.length > 0) {
    return (
      <SideContent header={t('event.Other_times')} icon={<IconCalendarPlus />}>
        <Container className="container">
          {eventData?.map((event: EventData, i: number) => (
            <div key={i} className={styles.relatedEvent}>
              <Link href={event.path.alias} style={{ width: 'fit-content' }}>
                <DateTimeSimple
                  startTime={event.field_start_time}
                  endTime={event.field_end_time}
                />
                <IconArrowRight size="s" aria-hidden />
              </Link>
            </div>
          ))}

          {events?.length > 3 && (
            <Button
              variant="supplementary"
              iconRight={showAll ? <IconAngleUp /> : <IconAngleDown />}
              style={{
                background: 'none',
                color: 'black',
                margin: 0,
                padding: 0,
              }}
              onClick={() => {
                setShowAll(!showAll);
              }}
            >
              {showAll ? t('event.showLess') : t('event.showAll')}
            </Button>
          )}
        </Container>
      </SideContent>
    );
  } else {
    return null;
  }
}
