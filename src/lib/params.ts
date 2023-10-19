import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

import { NODE_TYPES, CONTENT_TYPES } from './drupalApiTypes'

// Common includes and fields for all page level NODE types.
const baseQueryParams = () =>
  new DrupalJsonApiParams()
    .addInclude([
      'field_content.field_list_of_links_links.field_list_of_links_image.field_media_image',
      'field_content.field_liftup_with_image_image.field_media_image',
      'field_content.field_image.field_media_image',
      'field_content.field_background_color',
      'field_notification',
      'field_content.field_accordion_items.field_accordion_item_content.field_link_list_with_description',
    ])
    .addFields(CONTENT_TYPES.MEDIA_IMAGE, [
      'field_media_image',
      'field_photographer',
    ])
    .addFields(CONTENT_TYPES.ACCORDION, [
      'field_accordion_type',
      'field_accordion_title_level',
      'field_accordion_text',
      'field_accordion_title',
      'field_accordion_items',
    ])
    .addFields(CONTENT_TYPES.ACCORDION_ITEM, [
      'field_accordion_item_content',
      'field_accordion_item_heading'
    ])
    .addFields(CONTENT_TYPES.BANNER, [
      'field_background_color',
      'field_banner_desc',
      'field_banner_title',
      'field_icon'
    ])
    .addFields(CONTENT_TYPES.LIST_OF_LINKS, [
      'field_list_of_links_design',
      'field_list_of_links_links',
      'field_list_of_links_title',
      'field_background_color'
    ])
    .addFields(CONTENT_TYPES.LIST_OF_LINKS_ITEM, [
      'field_list_of_links_link',
      'field_list_of_links_image',
      'field_list_of_links_desc',
    ])
    .addFields(CONTENT_TYPES.LIFTUP_WITH_IMAGE, [
      'field_liftup_with_image_title',
      'field_liftup_with_image_image',
      'field_liftup_with_image_design',
      'field_liftup_with_image_desc'
    ])
    .addFields(CONTENT_TYPES.COLOR, [
      'name',
      'field_css_name'
    ])
    .addFields(CONTENT_TYPES.FILE, [
      'uri',
      'url',
      'image_style_uri',
      'width'
    ])
    .addFields(CONTENT_TYPES.NOTIFICATION, [
      'field_notification_title',
      'field_notification_description'
    ])

    .addFields(CONTENT_TYPES.PARAGRAPH_IMAGE, [
      'field_image',
      'field_image_caption',
      'field_original_aspect_ratio'
    ])
    .addFields(CONTENT_TYPES.QUOTE, [
      'field_quote_content',
      'field_quote_author_first_name',
      'field_quote_author_last_name',
      'field_quote_author_title'
    ])
    .addFields(CONTENT_TYPES.LINK_WITH_ICON, [
      'field_header',
      'field_link_list_title',
      'field_icon',
      'field_icon_positioning',
      'field_link_list_with_description',
    ])

const getPageQueryParams = () =>
  baseQueryParams()
    .addFields(NODE_TYPES.PAGE, [
      'id',
      'title',
      'path',
      'revision_timestamp',
      'langcode',
      'field_content',
      'field_lead_in',
      'field_metatags',
      'field_notification',
      'field_lower_content',
      'field_hide_sidebar',
      'field_hide_navigation',
    ])
    .addInclude([
      'field_content.field_accordion_items.field_accordion_item_content',
      'field_lower_content',
    ])
    .addFields(CONTENT_TYPES.TEXT, [
      'field_text'
    ])
    .addFields(CONTENT_TYPES.SUBHEADING, [
      'field_subheading_title'
    ])
    .addFields(CONTENT_TYPES.SUJO_EMBEDDED, [
      'field_training'
    ])
    .getQueryObject()

const getLandingPageQueryParams = () =>
  baseQueryParams()
    .addFields(NODE_TYPES.LANDING_PAGE, [
      'id',
      'title',
      'path',
      'revision_timestamp',
      'langcode',
      'field_content',
      'field_hero',
      'field_metatags',
      'field_notification',
      'field_hide_navigation'
    ])
    .addInclude([
      'field_hero.field_custom_hero_image.field_media_image',
      'field_content.field_accordion_items.field_accordion_item_content'
    ])
    .addFields(CONTENT_TYPES.HERO, [
      'field_hero_desc',
      'field_custom_hero_image'
    ])
    .addFields(CONTENT_TYPES.EVENTS_LIST, [
      'field_title',
      'field_events_list_short',
      'field_event_tag_filter',
      'field_background_color',
      'field_events_list_desc',
    ])
    .addFields(CONTENT_TYPES.NEWS_LIST, [
      'field_title',
      'field_short_list',
      'field_news_filter',
      'field_news_list_desc',
      'field_background_color',
      'field_news_filter',
    ])
    .getQueryObject()

export const baseEventQueryParams = () =>
  new DrupalJsonApiParams()
  .addInclude([
    'field_event_tags.content_translation_uid',
    'field_event_tags.parent',
    'field_in_language.content_translation_uid',
    'field_in_language.parent',
  ])
    .addFields(NODE_TYPES.EVENT, [
      'id',
      'title',
      'path',
      'langcode',
      'field_text',
      'field_location',
      'field_location_id',
      'field_start_time',
      'field_end_time',
      'field_event_status',
      'field_tags',
      'field_image_url',
      'field_image_name',
      'field_image_alt',
      'field_external_links',
      'field_info_url',
      'field_short_description',
      'field_street_address',
      'field_location_extra_info',
      'field_offers_info_url',
      'field_event_tags',
      'field_provider',
      'field_super_event',
      'field_publisher',
      'field_provider',
      'field_in_language'
    ])

const getEventPageQueryParams = () =>
  baseEventQueryParams()
    .getQueryObject()

export const baseArticlePageQueryParams = () =>
  new DrupalJsonApiParams()
    .addInclude([
      'field_content.field_list_of_links_links.field_list_of_links_image.field_media_image',
      'field_content.field_image.field_media_image',
      'field_content.field_liftup_with_image_image.field_media_image',
      'field_content.field_background_color',
      'field_content.field_accordion_items.field_accordion_item_content',
    ])
    .addFields(NODE_TYPES.ARTICLE, [
      'id',
      'title',
      'path',
      'created',
      'revision_timestamp',
      'langcode',
      'field_lead',
      'field_content',
      'field_article_category',
      'status',
      'published_at',
    ])
    .addFields(CONTENT_TYPES.TEXT, [
      'field_text'
    ])
    .addFields(CONTENT_TYPES.SUBHEADING, [
      'field_subheading_title'
    ])
    .addFields(CONTENT_TYPES.PARAGRAPH_IMAGE, [
      'field_image',
      'field_image_caption',
      'field_original_aspect_ratio'
    ])
    .addFields(CONTENT_TYPES.QUOTE, [
      'field_quote_content',
      'field_quote_author_first_name',
      'field_quote_author_last_name',
      'field_quote_author_title'
    ])
    .addFields(CONTENT_TYPES.MEDIA_IMAGE, [
      'field_media_image',
      'field_photographer',
    ])
    .addFields(CONTENT_TYPES.ACCORDION, [
      'field_accordion_type',
      'field_accordion_title_level',
      'field_accordion_text',
      'field_accordion_title',
      'field_accordion_items'
    ])
    .addFields(CONTENT_TYPES.ACCORDION_ITEM, [
      'field_accordion_item_content',
      'field_accordion_item_heading'
    ])
    .addFields(CONTENT_TYPES.BANNER, [
      'field_background_color',
      'field_banner_desc',
      'field_banner_title',
      'field_icon'
    ])
    .addFields(CONTENT_TYPES.LIST_OF_LINKS, [
      'field_list_of_links_design',
      'field_list_of_links_links',
      'field_list_of_links_title',
      'field_background_color'
    ])
    .addFields(CONTENT_TYPES.LIST_OF_LINKS_ITEM, [
      'field_list_of_links_link',
      'field_list_of_links_image',
      'field_list_of_links_desc',
    ])

const getArticlePageQueryParams = () =>
  baseArticlePageQueryParams()
    .getQueryObject()

export const baseTprUnitQueryParams = () =>
  new DrupalJsonApiParams()
    .addInclude([
      'field_content',
      'field_lower_content',
      'picture_url_override.field_media_image',
      'field_content.field_accordion_items.field_accordion_item_content',
      'field_content.field_list_of_links_links.field_list_of_links_image.field_media_image',
    ])
    .addFields(NODE_TYPES.TPR_UNIT, [
      'id',
      'path',
      'name',
      'name_override',
      'description',
      'langcode',
      'field_metatags',
      'field_content',
      'field_lower_content',
      'phone',
      'email',
      'address',
      'address_postal',
      'opening_hours',
      'call_charge_info',
      'service_map_embed',
      'picture_url_override',
      'picture_url',
      'drupal_internal__id',
      'accessibility_sentences',
    ])
    .addFields(CONTENT_TYPES.ACCORDION, [
      'field_accordion_type',
      'field_accordion_title_level',
      'field_accordion_text',
      'field_accordion_title',
      'field_accordion_items'
    ])
    .addFields(CONTENT_TYPES.ACCORDION_ITEM, [
      'field_accordion_item_content',
      'field_accordion_item_heading'
    ])
    .addFields(CONTENT_TYPES.LIST_OF_LINKS, [
      'field_list_of_links_design',
      'field_list_of_links_links',
      'field_list_of_links_title',
      'field_background_color'
    ])
    .addFields(CONTENT_TYPES.LIST_OF_LINKS_ITEM, [
      'field_list_of_links_link',
      'field_list_of_links_image',
      'field_list_of_links_desc',
    ])
    .addFields(CONTENT_TYPES.NOTIFICATION, [
      'field_notification_title',
      'field_notification_description'
    ])
    .addFields(CONTENT_TYPES.EVENTS_LIST, [
      'field_title',
      'field_events_list_short',
      'field_event_tag_filter',
      'field_background_color',
      'field_events_list_desc'
    ])
    .addFields(CONTENT_TYPES.UNIT_MAP, [
      'field_unit_map'
    ])

const getTprUnitQueryParams = () =>
  baseTprUnitQueryParams()
    .getQueryObject()

export const getQueryParamsFor = (type: string) => {
  switch (type) {
    case NODE_TYPES.PAGE:
      return getPageQueryParams()
  }
  switch (type) {
    case NODE_TYPES.LANDING_PAGE:
      return getLandingPageQueryParams()
  }
  switch (type) {
    case NODE_TYPES.EVENT:
      return getEventPageQueryParams()
  }
  switch (type) {
    case NODE_TYPES.ARTICLE:
      return getArticlePageQueryParams()
  }

  switch (type) {
    case NODE_TYPES.TPR_UNIT:
      return getTprUnitQueryParams()
  }
}
