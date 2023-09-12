import axios from 'axios'
import { CACHE_HEADERS_10M } from '@/cache-headers'

const DRUPAL_SITEMAP = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/default/sitemap.xml`

export const getServerSideProps = async ({ res }) => {
  const { data: sitemap, error } = await axios.get(DRUPAL_SITEMAP, {
    responseType: 'text',
  })  

  if (error) {
    console.log('Sitemap error')
  }
  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader(...CACHE_HEADERS_10M)
  res.write(sitemap)
  res.end()
  // to suppress error in nextjs
  return { props: {} }
}

const Sitemap = () => {
  return null;
}

// Default export to prevent next.js errors
export default Sitemap
