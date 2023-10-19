import Link from 'next/link';

import styles from './link.module.scss';

interface IconLinkProps {
  url: string;
  icon: string;
  title: string;
  iconPosition: string;
}

function IconLink({ url, icon, title, iconPosition }: IconLinkProps) {

  if (iconPosition === 'Before') {
    return (
      <>
        <Link href={url} className={styles.iconLinkBefore}>
          <i className={`hds-icon hds-icon--${icon} hds-icon--size-s `}></i>
          {title}
        </Link>
      </>
    );
  } else {
    return (
      <Link href={url} className={styles.iconLinkAfter}>
        {title}
        <i className={`hds-icon hds-icon--${icon} hds-icon--size-s `}></i>
      </Link>
    );
  }
}

export default IconLink;