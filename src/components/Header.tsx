import { useTranslation } from 'next-i18next'
import { Navigation, Button } from 'hds-react'
import { HeaderProps } from 'src/lib/types'

function Header(header:HeaderProps): JSX.Element {

  const { locale, menu, themes, langLinks } = header
  const { t } = useTranslation('common')

  const activePath = langLinks[locale]

  const getNavi = (menuArray: any) => {
    const nav: any = [];
    if (!menuArray) {
      return <></>
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
            active={sub.url === activePath}
            // onClick={function noRefCheck() {}}
          />
        )
        return subs
      })
      nav.push(
        <Navigation.Dropdown label={item.title} key={item.title}>
          {subs}
        </Navigation.Dropdown>
      )
      return nav
    })
    return nav
  }

  const getThemes = (links: any) => {
    if (!links) {
      return <></>
    }
    const nav: any = []
    links.map((item: any, index: number) => {
      nav.push(
        <Navigation.Item
          key={item.title}
          href={item.url}
          label={item.title}
          lang="und"
          active={item.url === activePath}
        />
      )
    })
    return nav
  }

  if (!menu&&!themes&&!langLinks) {
    return <></>
  }

  return (
    <Navigation
      menuToggleAriaLabel="Menu"
      logoLanguage={locale === "sv" ? "sv" : "fi"}
      skipTo="#content"
      skipToContentLabel="Skip to main content"
      theme={{
        "--header-divider-color": "white",
      }}
      title={t("site_name")}
      titleAriaLabel={t("navigation.title_aria_label")}
    >
      <Navigation.Actions>
        <Navigation.Item
          href={langLinks.fi}
          hrefLang='fi'
          label="Suomeksi"
          active={langLinks.fi === activePath}
        />
        <Navigation.Item
          href={langLinks.sv}
          hrefLang='sv'
          label="På svenska"
          active={langLinks.sv === activePath}
        />
        <Navigation.Item
          href={langLinks.en}
          hrefLang='en'
          label="In English"
          active={langLinks.en === activePath}
        />
      <Navigation.Dropdown label="🌐" key="theme_dropdown">
        {getThemes(themes)}
      </Navigation.Dropdown>
      <Button
          size="small"
          variant="secondary"
          key="navigation_button"
          onClick={() => {
            window.location.href = t("navigation.button_link")
          }}
        >
          {t("navigation.button_text")}
        </Button>
      </Navigation.Actions>
      <Navigation.Row>
        {getNavi(menu)}
      </Navigation.Row>
    </Navigation>
  );
}

export default Header;