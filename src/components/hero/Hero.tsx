import Image from 'next/image'
import { Koros, IconArrowDown } from 'hds-react';
import HtmlBlock from '@/components/HtmlBlock'
import { DrupalFormattedText } from '@/lib/types'
import { getImageUrl } from '@/lib/helpers'

import styles from './hero.module.scss'


interface HeroProps {
  title: string
  field_hero_desc: DrupalFormattedText
  field_custom_hero_image: any
}

function Hero(props: HeroProps): JSX.Element {
  const { title, field_hero_desc, field_custom_hero_image } = props
  const rootKorosStyle = { '--koros-height': '120px', '--hero-height': '480px', '--hero-width': '950px' };

  return (
    <>
      <div className={styles.heroContainer}>
        <div className={styles.heroTextContainer}>
          <div className={styles.heroTextContent}>
            <h1>{title}</h1>
            { field_hero_desc && 
              <HtmlBlock field_text={field_hero_desc} />
            }      
          </div>
          <Koros
            className={styles.heroMobileKoros}
            style={{
              fill: 'var(--color-fog-medium-light)',
              width: 'calc(2 * var(--hero-height))',
              zIndex: '2',
              position: 'relative'
            }}
            rotate='180deg'
          />
          <span className={styles.heroArrow} aria-hidden='true'>
            <IconArrowDown
              size="xl"
              style={{ 
                color: 'var(--color-metro)',
                width: '150px',
                height: '150px'
              }}/>
          </span>
        </div>

        <div className={styles.heroImageContainer}>
          <div
            className={styles.heroKorosWrapper}
            style={{
              ...rootKorosStyle,
              height: 'var(--hero-height)',
              maxWidth: '100%',
              overflow: 'hidden',
              position: 'relative',
              width: 'var(--hero-width)',
              zIndex: '1'
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--color-fog-medium-light)',
                clipPath: 'polygon(0 0, var(--hero-height) 0, 0 100%, 0% 100%)',
                height: '100%',
              }}
            />
            <Koros
              style={{
                fill: 'var(--color-fog-medium-light)',
                left: 'calc(-1 * var(--koros-height))',
                position: 'absolute',
                top: 'var(--koros-height)',
                transformOrigin: 'center',
                width: 'calc(2 * var(--hero-height))',
              }}
              rotate='135deg'
            />
          </div>
          <Image
            src={getImageUrl(field_custom_hero_image?.field_media_image?.image_style_uri?.['hero'])}
            alt=''
            layout='fill'
            objectFit='cover'
          />
        </div>
      </div>
    </>
  )
}

export default Hero
