import Image from 'next/image';
import { Container } from 'hds-react';

import { DrupalFormattedText } from '@/lib/types';
import { getImageUrl } from '@/lib/helpers';

import styles from './paragraphImage.module.scss';

interface ParagraphImageProps {
  field_image: any;
  field_image_caption: DrupalFormattedText;
  field_original_aspect_ratio: boolean;
}

// TODO: Get Drupal Image styles dimensions programmatically.
const imageStyleDimensions = {
  '3_2_m_width': 1024,
  '3_2_m_height': 683,
};

function ParagraphImage(props: ParagraphImageProps): JSX.Element {
  const { field_image, field_image_caption, field_original_aspect_ratio } =
    props;
  const imageStyleUri = field_original_aspect_ratio
    ? getImageUrl(field_image?.field_media_image?.uri?.url)
    : getImageUrl(field_image?.field_media_image?.image_style_uri?.['3_2_m']);
  
  const imageWidth = imageStyleDimensions['3_2_m_width'];
  const imageHeight = imageStyleDimensions['3_2_m_height'];
  
  //TODO: Add translation functionality to caption and photographer
  return (
    <div className="component">
      <Container className="container">
        <div className={`${styles.paragraphImage}`}>
          <figure>
            <Image
              src={imageStyleUri}
              alt={field_image?.field_media_image?.resourceIdObjMeta?.alt}
              layout={'responsive'}
              width={
                field_original_aspect_ratio
                  ? field_image?.field_media_image?.resourceIdObjMeta?.width
                  : imageWidth 
              }
              height={
                field_original_aspect_ratio
                  ? field_image?.field_media_image?.resourceIdObjMeta?.height
                  : imageHeight
              }
            />
            {field_image_caption && (
              <figcaption className={styles.imgCaption}>
                {field_image_caption}
              </figcaption>
            )}
            {field_image?.field_photographer && (
              <figcaption className={styles.imgCaption}>
                {field_image.field_photographer}
              </figcaption>
            )}
          </figure>
        </div>
      </Container>
    </div>
  );
}

export default ParagraphImage;
