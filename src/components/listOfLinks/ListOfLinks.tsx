import { Linkbox, Container } from 'hds-react';

import Link from '@/components/link/Link';
import { isExternalLink, getImageUrl } from '@/lib/helpers';
import styles from './listOfLinks.module.scss';

type ListOfLinksDesign = 'with-image' | 'without-image' | 'without-image-desc';
interface ListOfLinksProps {
  field_list_of_links_title: string;
  field_list_of_links_design: ListOfLinksDesign;
  field_background_color: {
    field_css_name: string;
  } | null;
  field_list_of_links_links: any;
}

interface FieldListOfLinks {
  id: string;
  field_list_of_links_desc: string;
  field_list_of_links_image: {
    field_media_image: {
      id: string;
      image_style_uri: any;
    };
  };
  field_list_of_links_link: {
    full_url: string;
    title: string;
    url: string;
    id: string;
  };
  links: {
    self: string;
  };
}

function ListOfLinks(props: ListOfLinksProps): JSX.Element {
  const {
    field_list_of_links_title,
    field_list_of_links_design: design,
    field_background_color,
    field_list_of_links_links,
  } = props;
  const bgColor = field_background_color?.field_css_name ?? 'white';
  return (
    <div
      className="component hide-print"
      style={{ backgroundColor: `var(--color-${bgColor})` }}
    >
      <Container className="container">
        <h2>{field_list_of_links_title}</h2>
        <div className={styles.listOfLinks}>
          {field_list_of_links_links.map((link: FieldListOfLinks) =>
            design === 'with-image' ? (
              <div className={`${styles.linkBox} link-box`} key={link.id}>
                <Linkbox
                  linkboxAriaLabel="List of links Linkbox"
                  linkAriaLabel="Linkbox link"
                  key={link.id}
                  href={link.field_list_of_links_link.full_url}
                  heading={link.field_list_of_links_link.title}
                  external={isExternalLink(
                    link.field_list_of_links_link.full_url
                  )}
                  imgProps={{
                    src: getImageUrl(
                      link.field_list_of_links_image?.field_media_image
                        ?.image_style_uri?.['1_1_s']
                    ),
                  }}
                />
              </div>
            ) : (
              <div className={`${styles.linkItem} link-item`} key={link.id}>
                <h3 className="flex">
                  <Link
                    fullAreaLink
                    href={link.field_list_of_links_link.full_url}
                    text={link.field_list_of_links_link.title}
                  />
                </h3>
                {design === 'without-image' && (
                  <div>{link.field_list_of_links_desc}</div>
                )}
              </div>
            )
          )}
        </div>
      </Container>
    </div>
  );
}

export default ListOfLinks;
