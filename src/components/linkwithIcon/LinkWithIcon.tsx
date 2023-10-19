import IconLink from '../link/IconLink';

interface LinkWithIconProps {
  field_header: string;
  field_link_list_title: string;
  field_icon: string;
  field_icon_positioning: string;
  field_link_list_with_description: any;
}

function LinkWithIcon({
  field_header,
  field_link_list_title,
  field_icon,
  field_icon_positioning,
  field_link_list_with_description,
}: LinkWithIconProps) {
  const linkTitle = (title: string, url: string) => {
    if (
      (url.slice(-4) === '.doc' || url.slice(-4) === '.pdf') &&
      field_icon_positioning === 'Before'
    ) {
      return `${title} (${url.slice(-4)})`;
    } else {
      return title;
    }
  };
  return (
    <>
      <h2>{field_header}</h2>
      <h3>{field_link_list_title}</h3>
      {field_link_list_with_description?.map((item: any, key: number) => (
        <div key={key}>
          <p>{item.field_description}</p>
          {item.field_links?.map((link: any, key: number) => (
            <div key={key}>
              <IconLink
                url={link.full_url}
                icon={field_icon}
                title={linkTitle(link.title, link.full_url)}
                iconPosition={field_icon_positioning}
              />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

export default LinkWithIcon;