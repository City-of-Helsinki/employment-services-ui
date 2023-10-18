import { Container } from 'hds-react';

import HtmlBlock from '@/components/HtmlBlock';
import ListOfLinks from '@/components/listOfLinks/ListOfLinks';
import Accordion from '@/components/accordion/Accordion';
import Banner from '@/components/banner/Banner';
import LiftupWithImage from '@/components/liftupWithImage/LiftupWithImage';
import Notification from '@/components/notification/Notification';
import { EventList } from '@/components/events/EventList';
import NewsList from '@/components/news/NewsList';
import ParagraphImage from '@/components/paragraphImage/ParagraphImage';
import Quote from '@/components/quote/Quote';
import SujoEmbedded from '@/components/sujoEmbedded/sujoEmbedded';
import Events from '@/components/events/Events';
import { CONTENT_TYPES } from '@/lib/drupalApiTypes';
import { NavProps } from '@/lib/types';
import UnitsList from './tprUnits/UnitsList';
import MapEmbedded from './mapEmbedded/MapEmbedded';

interface ContentMapperProps {
  content: any;
  pageType?: string;
  mapId?: number | null;
  locationId?: string | null;
  langcode?: string;
  sidebar?: NavProps;
  className?: string;
}

export function ContentMapper({
  content,
  pageType,
  locationId,
  mapId,
  langcode,
  sidebar,
  className,
  ...props
}: ContentMapperProps): JSX.Element {
  return content.map((item: any) => {
    const { type, id } = item;
    const key = `paragraph--${type}-${id}`;

    switch (type) {
      case CONTENT_TYPES.TEXT:
        if (!item?.field_text?.processed) {
          return null;
        }
        return (
          <div className={`component ${className}`} key={key}>
            <Container className="container">
              <HtmlBlock {...item} key={key} />
            </Container>
          </div>
        );

      case CONTENT_TYPES.ACCORDION:
        if (!item?.field_accordion_items) {
          return null;
        }
        return <Accordion {...item} key={key} />;

      case CONTENT_TYPES.LIST_OF_LINKS:
        if (!item?.field_list_of_links_links) {
          return null;
        }
        return <ListOfLinks {...item} key={key} />;

      case CONTENT_TYPES.BANNER:
        if (!item?.id) {
          return null;
        }
        return <Banner {...item} key={key} />;

      case CONTENT_TYPES.NOTIFICATION:
        if (!item?.id) {
          return null;
        }
        return <Notification {...item} key={key} />;

      case CONTENT_TYPES.SUBHEADING:
        if (!item?.field_subheading_title) {
          return null;
        }
        return (
          <div className="component" key={key}>
            <Container className="container">
              <h2>{item.field_subheading_title}</h2>
            </Container>
          </div>
        );

      case CONTENT_TYPES.EVENTS_LIST:
        if (!item?.id) {
          return null;
        }
        if (item.field_events_list_short) {
          return (
            <EventList
              {...item}
              pageType={pageType}
              key={key}
              locationId={locationId}
            />
          );
        }
        return <Events {...item} key={key} />;

      case CONTENT_TYPES.NEWS_LIST:
        if (!item?.id) {
          return null;
        }
        return <NewsList {...item} langcode={langcode} key={key} />;

      case CONTENT_TYPES.LIFTUP_WITH_IMAGE:
        if (!item?.field_liftup_with_image_image) {
          return null;
        }
        return <LiftupWithImage {...item} key={key} />;

      case CONTENT_TYPES.PARAGRAPH_IMAGE:
        if (!item?.field_image) {
          return null;
        }
        return <ParagraphImage {...item} key={key} />;

      case CONTENT_TYPES.QUOTE:
        if (!item?.field_quote_content) {
          return null;
        }
        return <Quote {...item} key={key} />;

      case CONTENT_TYPES.SUJO_EMBEDDED:
        if (typeof item.field_training !== 'boolean') {
          return null;
        }
        return <SujoEmbedded {...item} key={key} />;

      case CONTENT_TYPES.UNIT_MAP:
        return <MapEmbedded mapId={mapId} {...item} key={key} />;

      case CONTENT_TYPES.UNITS_LIST:
        if (!item?.id) {
          return null;
        }
        return <UnitsList {...sidebar} key={key} />;

      default:
        console.log('unmapped type: ', type);
    }
  });
}

export default ContentMapper;
