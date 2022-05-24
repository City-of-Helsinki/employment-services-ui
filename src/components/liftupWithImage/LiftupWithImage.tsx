import Image from 'next/image'
import { DrupalFormattedText } from 'src/lib/types'
import HtmlBlock from '@/components/HtmlBlock'

import styles from './liftupWithImage.module.scss'


type LiftupWithImageDesign = 'image-on-right' | 'image-on-left' | 'image-on-right-secondary' | 'image-on-left-secondary' | 'background-text-on-right' | 'background-text-on-left'

interface LiftupWithImageProps {
  field_liftup_with_image_title: string
  field_liftup_with_image_image: any
  field_liftup_with_image_design: LiftupWithImageDesign
  field_liftup_with_image_desc: DrupalFormattedText
}

function LiftupWithImage(props: LiftupWithImageProps): JSX.Element {
  const { field_liftup_with_image_title, field_liftup_with_image_image, field_liftup_with_image_design: design, field_liftup_with_image_desc } = props
  const textAlign = design === 'image-on-right' || design == 'image-on-right-secondary' || design === 'background-text-on-left' ? styles.textLeft : styles.textRight
  const contentBgSecondary = design ===  'image-on-right-secondary' || design == 'image-on-left-secondary' ? styles.contentBgSecondary : '';
  const imageFullWidth = design ===  'background-text-on-right' || design == 'background-text-on-left' ? styles.imageFullWidth : '';
  const imageStyle = design ===  'background-text-on-right' || design == 'background-text-on-left' ? field_liftup_with_image_image?.field_media_image?.image_style_uri?.['23_10_l'] : field_liftup_with_image_image?.field_media_image?.image_style_uri?.['3_2_m'];
  const imageWidth = design ===  'background-text-on-right' || design == 'background-text-on-left' ? 1440 : 1024;
  const imageHeight = design ===  'background-text-on-right' || design == 'background-text-on-left' ? 626 : 683;

  return (
    <div className='component'>
      <div className={`${styles.liftupWithImage} ${textAlign} ${imageFullWidth}`}>
        <div className={styles.liftupWithImageImage}>
          <Image
            src={imageStyle}
            alt={field_liftup_with_image_image?.field_media_image?.resourceIdObjMeta?.alt}
            layout='responsive'
            width={imageWidth}
            height={imageHeight}
          />
        </div>
        <div className={styles.liftupWithImageContentWrapper}>
          <div className={`${styles.liftupWithImageContent}  ${contentBgSecondary}`}>
            <h2>{field_liftup_with_image_title}</h2>
            { field_liftup_with_image_desc.processed && 
              <HtmlBlock field_text={field_liftup_with_image_desc} /> 
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiftupWithImage;
