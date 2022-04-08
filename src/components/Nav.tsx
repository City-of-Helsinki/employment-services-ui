import { Navigation, Button } from "hds-react"
import { DrupalMenuLinkContent } from "next-drupal"

interface NavProps {
  menu: DrupalMenuLinkContent[],
}

function Nav({menu}:NavProps): JSX.Element {
  console.log('menu', menu)

  const getNavi = (menuArray: any) => {
    const nav: any = [];
    if (!menuArray) {
      return <></>;
    }

    menuArray.map((item: any, index: number) => {
      const subs: any = [];
      item.items?.map((sub: any, i: number) => {
        subs.push(
          <Navigation.Item
            key={sub.title}
            as="a"
            href={sub.url}
            label={sub.title}
            // onClick={function noRefCheck() {}}
          />
        );
        return subs;
      });
      nav.push(
        <Navigation.Dropdown label={item.title} key={item.title}>
          {subs}
        </Navigation.Dropdown>
      );
      return nav;
    });
    return nav;
  };

  if (!menu) {
    return <></>;
  }

  return (
    <Navigation
      menuToggleAriaLabel="Menu"
      skipTo="#content"
      skipToContentLabel="Skip to main content"
      theme={{
        "--header-divider-color": "white",
      }}
      title="työllisyyspalvelut"
      titleAriaLabel={"navigation.title_aria_label"}
    >
      <Navigation.Actions>
        <div style={{ marginLeft: "auto" }}>
          <Button
            size="small"
            variant="secondary"
            onClick={() => {
              window.location.href = "navigation.button_link"
            }}
          >
            {"navigation.button_text"}
          </Button>
        </div>
        <Navigation.LanguageSelector label="Language">
          <Navigation.Item
            href="#"
            label="Suomeksi"
            onClick={(e: any) => {
              e.preventDefault();
            }}
          />
          <Navigation.Item
            href="#"
            label="På svenska"
            onClick={(e: any) => {
              e.preventDefault();
            }}
          />
          <Navigation.Item
            href="#"
            label="In English"
            onClick={(e: any) => {
              e.preventDefault();
            }}
          />
        </Navigation.LanguageSelector>
      </Navigation.Actions>
      <Navigation.Row>
        {getNavi(menu)}
      </Navigation.Row>
    </Navigation>
  );
}

export default Nav;