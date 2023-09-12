import { Container } from 'hds-react'

import { DrupalFormattedText } from '@/lib/types'
import HtmlBlock from '@/components/HtmlBlock'
import 'hds-core/lib/icons/icon.min.css'
import 'hds-core/lib/icons/all.min.css'

import styles from './banner.module.scss'

interface BannerProps {
  field_background_color: {
    field_css_name: string
  } | null
  field_banner_desc: DrupalFormattedText
  field_banner_title: string
  field_icon: string
}

function Banner(props: BannerProps): JSX.Element {
  const { field_background_color, field_banner_desc, field_banner_title, field_icon } = props
  const bgColor = field_background_color?.field_css_name ?? 'white'

  return (
    <div className='component'>
      <Container className='container'>
        <div className={styles.banner} style={{ backgroundColor: `var(--color-${bgColor})` }}>
          { field_icon && 
            <div className={styles.bannerIcon}>
              <i className={`hds-icon hds-icon--${field_icon} hds-icon--size-xl`}></i>
            </div>
          }

          <div className="banner-content">
            {field_banner_title && 
              <h2>{field_banner_title}</h2>
            }
            {field_banner_desc && 
              <HtmlBlock field_text={field_banner_desc} />
            }
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Banner
