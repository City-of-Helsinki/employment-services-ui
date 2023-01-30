import { useEffect, useState } from 'react'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { Linkbox, Button as HDSButton, IconPlus, IconCrossCircle, IconArrowRight, Container } from 'hds-react'

import { DrupalFormattedText, EventsQueryParams, EventState, EventListProps } from '@/lib/types'
import { getEvents, getEventsSearch } from '@/lib/client-api'
import { eventTags, getPath, getPathAlias } from '@/lib/helpers'

import HtmlBlock from '@/components/HtmlBlock'
import TagList from './TagList'
import DateTime from './DateTime'

import styles from './events.module.scss'
import EventStatus from './EventStatus'

export function EventList({ pageType, locationId, ...props }: EventListProps): JSX.Element {
  const { field_title, field_events_list_short, field_event_tag_filter: tags, field_background_color, field_events_list_desc } = props
  const bgColor = field_background_color?.field_css_name || 'white'
  const { t } = useTranslation()
  const { locale, asPath } = useRouter()

  const queryParams: EventsQueryParams = {
    tags: tags,
    locationId: pageType === 'tpr_unit' ? locationId : null,
    locale: locale
  }

  const fetcher = () => getEvents(queryParams)
  const { data, error } = useSWR(
    `/${locale}/${asPath}`,
    fetcher
  )

  const events = data && (pageType === 'basic' || pageType === 'tpr_unit') ? data.slice(0, 2) : data

  return (
    <div className='component hide-print' style={{ backgroundColor: `var(--color-${bgColor})` }}>
      <Container className='container'>
        <div className={styles.eventListTitleArea}>
          {field_title &&
            <h2>{field_title}</h2>
          }
          {field_events_list_short &&
            <a href={t('list.events_page_url')}>{t('list.show_all_events')} <IconArrowRight size="l" /></a>
          }
        </div>

        {field_events_list_desc?.processed &&
          <div className={styles.eventListDescription}>
            <HtmlBlock field_text={field_events_list_desc} />
          </div>
        }
        <div className={`${styles.eventList} ${field_events_list_short && styles.short}`}>
          { events?.length
            ? events.map((event: any, key: any) => (
                <div className={`${styles.eventCard} event-card`} key={key}>
                  <Linkbox
                    className={styles.linkBox}
                    linkboxAriaLabel="List of links Linkbox"
                    linkAriaLabel="Linkbox link"
                    key={key}
                    href={getPathAlias(event.path)}
                    withBorder
                  >
                    <Image
                      src={event.field_image_url}
                      alt=''
                      layout='responsive'
                      objectFit='cover'
                      width={384}
                      height={158}
                    />
                    <div className={styles.eventCardContent}>
                      {event.field_tags && event.field_tags.length !== 0 && <TagList tags={event.field_tags} /> }
                      <DateTime startTime={event.field_start_time} endTime={event.field_end_time} />
                      <h3><EventStatus {...event} />{event.title}</h3>
                      <p>{event.field_location}{ event.field_street_address ? `, ${event.field_street_address}` : ''}</p>
                    </div>
                  </Linkbox>
                </div>
              )) 
            : t('list.no_events')
          }
        </div>
      </Container>
    </div>
  )
}
