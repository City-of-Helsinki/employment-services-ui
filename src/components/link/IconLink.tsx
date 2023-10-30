import Link from 'next/link';

import styles from './link.module.scss';

interface IconLinkProps {
  url: string;
  icon: string;
  title: string;
}

function IconLink({ url, icon, title }: IconLinkProps) {
  return (
    <>
      <Link href={url} className={styles.iconLinkBefore}>
        <i className={`hds-icon hds-icon--${icon} hds-icon--size-s `}></i>
        {title}
      </Link>
    </>
  );
}

export default IconLink;
