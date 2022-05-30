import { Linkbox } from 'hds-react'

import Link from '@/components/link/Link'
import { isExternalLink, getImageUrl } from '@/lib/helpers'
import styles from './listOfLinks.module.scss'


type ListOfLinksDesign = 'with-image' | 'without-image' | 'without-image-desc';
interface ListOfLinksProps {
  field_list_of_links_design: ListOfLinksDesign
  field_list_of_links_links: any
  field_list_of_links_title: string
}

function ListOfLinks(props: ListOfLinksProps): JSX.Element {
  const { field_list_of_links_design: design, field_list_of_links_links, field_list_of_links_title } = props;

  return (
    <div className="component">
      <h2>{field_list_of_links_title}</h2>
      <div className={styles.listOfLinks}>
        { field_list_of_links_links.map((link: any, key: any) => (
          design === 'with-image' ? (
            <div className={`${styles.linkBox} link-box`} key={key}>
              <Linkbox
                linkboxAriaLabel="List of links Linkbox"
                linkAriaLabel="Linkbox link"
                key={key}
                href={link.field_list_of_links_link.url} 
                heading={link.field_list_of_links_link.title}
                external={isExternalLink(link.field_list_of_links_link.url)}
                imgProps={{ src: getImageUrl(link.field_list_of_links_image?.field_media_image?.image_style_uri?.['1_1_s'])}}
              />
            </div>
          ) : (
            <div className={`${styles.linkItem} link-item`} key={key}>
              <h3 className="flex">
                <Link
                  href={link.field_list_of_links_link.url}
                  text={link.field_list_of_links_link.title}
                />
              </h3>
              { design === 'without-image' && <div>{link.field_list_of_links_desc}</div> }
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default ListOfLinks;
