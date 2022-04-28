import Image from 'next/image'
import Link from 'next/link'

import HtmlBlock from '@/components/HtmlBlock'
import { CONTENT_TYPES } from '@/lib/drupalApiTypes'
import ListOfLinks from '@/components/listOfLinks/ListOfLinks';
import Accordion from '@/components/accordion/Accordion';


interface ContentMapperProps {
  content: any
}

export function ContentMapper({ content, ...props }: ContentMapperProps): JSX.Element {

  // console.log('content: ', content)
  return content.map((item: any) => {
    const {type, id} = item

    const key = `paragraph--${type}-${id}`

    switch(type) {
      case CONTENT_TYPES.TEXT:
        if (!item?.field_text?.processed) {
          // console.log('text', item)
          return null
        }
        return <HtmlBlock {...item} key={key} />

      case CONTENT_TYPES.ACCORDION:
        if (!item?.field_accordion_items) {
          return null
        }
        return (
          <Accordion {...item} key={key} />
        )

      case CONTENT_TYPES.LIST_OF_LINKS:
        if (!item?.field_list_of_links_links) {
          return null
        }
        return <ListOfLinks {...item} key={key} />
      
      case CONTENT_TYPES.HEADING:
      case CONTENT_TYPES.PARAGRAPH_IMAGE:
      case CONTENT_TYPES.HERO:
      case CONTENT_TYPES.VIDEO_REMOTE:
      case CONTENT_TYPES.FILE:
      case CONTENT_TYPES.MEDIA_IMAGE:
      case CONTENT_TYPES.MEDIA_VIDEO:
      case CONTENT_TYPES.COLUMNS:
      case CONTENT_TYPES.COLUMN_LEFT:
      case CONTENT_TYPES.COLUMN_RIGHT:
        // console.log('item', item)
        return <div key={key}>{type}</div>

      default:
        console.log('unmapped type: ', type);
    }
  })
}

export default ContentMapper