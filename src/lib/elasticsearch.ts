import getConfig from 'next/config'
import { Client } from '@elastic/elasticsearch'


export const getElasticClient = (): Client => {
  const config = getConfig().serverRuntimeConfig
  const {
    elasticsearch_password,
    ELASTICSEARCH_URL,
    elasticsearch_certificate,
  } = config

  if (!ELASTICSEARCH_URL) {
    throw new Error('ERROR: ELASTICSEARCH_URL not set');
  }

  if (!config.elasticsearch_password) {
    console.log('Warning: Elasticsearch client running in userless mode')
    return new Client({ node: ELASTICSEARCH_URL })
  }

  return new Client({
    node: ELASTICSEARCH_URL,
    auth: {
      username: 'elastic',
      password: elasticsearch_password || 'changeme',
    },
    tls: {
      ca: elasticsearch_certificate,
      rejectUnauthorized: false,
    }
  })
}

