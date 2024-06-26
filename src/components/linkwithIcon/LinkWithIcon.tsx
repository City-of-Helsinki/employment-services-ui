import Link from 'next/link';
import IconLink from '../link/IconLink';

import styles from './linkWithIcon.module.scss';

interface LinkWithIconProps {
  field_header: string;
  field_link_list_title: string;
  field_icon: string;
  field_icon_positioning: string;
  field_link_list_with_description: any;
}

function LinkWithIcon({
  field_header,
  field_icon,
  field_link_list_with_description,
}: LinkWithIconProps) {
  const linkTitle = (title: string, url: string) => {
    if (url.slice(-4) === '.doc' || url.slice(-4) === '.pdf') {
      return `${title} (${url.slice(-4)})`;
    } else {
      return title;
    }
  };
  return (
    <>
      <h2>{field_header}</h2>
      {field_link_list_with_description?.map((item: any, key: number) => (
        <div key={key}>
          {item.field_link_list_title && <h3>{item.field_link_list_title}</h3>}
          {item.field_description && <p>{item.field_description}</p>}
          {item.field_links?.map((link: any, key: number) => (
            <div key={key} className={styles.iconLink}>
              {field_icon !== null ? (
                <IconLink
                  url={link.full_url}
                  icon={field_icon}
                  title={linkTitle(link.title, link.full_url)}
                />
              ) : (
                <Link href={link.full_url}>{linkTitle(link.title, link.full_url)}</Link>
              )}
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

export default LinkWithIcon;
