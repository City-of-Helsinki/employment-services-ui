import { getResourceCollection } from 'next-drupal'

import { NODE_TYPES } from '@/lib/drupalApiTypes'
import { Tags } from 'src/lib/types'
import { baseEventQueryParams } from './params'

export const getEvents = async ({ tags }: Tags) => {
  const eventParams = () =>
    baseEventQueryParams()
      .addSort('field_end_time', 'ASC')
      .addPageLimit(3)

    if (tags) {
      const filteredEventParams = () =>
        eventParams()
          .addFilter('field_tags', tags, 'IN')
          .getQueryObject()

      return await getResourceCollection(NODE_TYPES.EVENT, { params: filteredEventParams() })
    }

  return await getResourceCollection(NODE_TYPES.EVENT, { params: eventParams().getQueryObject() })
}

export const getEventsSearch = async ({ tags }: Tags) => {

}