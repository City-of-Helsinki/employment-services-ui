import { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { DrupalMenuLinkContent } from 'next-drupal'
import { Navigation, IconArrowTopRight, IconGlobe } from 'hds-react'

import { NavProps } from '@/lib/types'
import { Breadcrumb } from './Breadcrumb'
import classNames from '@/lib/classNames'
import { printablePages } from '@/lib/helpers'

import styles from './navigation.module.scss'
import PrintButton from '../printButton/PrintButton'
import { useRouter } from 'next/router'

function Header(header:NavProps): JSX.Element {

  const { locale, menu, themes, langLinks, breadcrumb } = header
  const { t } = useTranslation('common')
  const router: any = useRouter()  // @TODO Fix type for proper
  const activePath = langLinks[locale]
  const [ pageProps, setPageProps ]: any | null = useState(null)
  const [ isPrintable, setIsPrintable ] = useState(false)

  useEffect(() => { 
    setPageProps(router.components[router.route].props.pageProps)

    if (!pageProps || pageProps.node === undefined) return

    if (printablePages.includes(pageProps.node.type)) {
      setIsPrintable(true)
    }    
  }, [pageProps])

  const getNavi = (menuArray: DrupalMenuLinkContent[]|undefined) => {
    const nav: ReactElement[] = []
    if (!menuArray) {
      return <></>
    }
    menuArray.map((item: DrupalMenuLinkContent, index: number) => {
      const subs: ReactElement[] = []
      let childActive = false
      item.items?.map((sub: DrupalMenuLinkContent, i: number) => {
        childActive = sub.url === activePath || childActive
        subs.push(
          <Navigation.Item
            key={sub.title}
            as="a"
            href={sub.url}
            label={sub.title}
            active={sub.url === activePath}
          />
        )
        return subs
      })
      const isActive = item.url === activePath || childActive
      nav.push(
        <Navigation.DropdownLink
          label={item.title}
          key={item.title}
          id={item.title}
          active={isActive}
          className={classNames(styles.navDropDown, isActive && styles.active)}
          href={item.url}
        >
          {subs}
        </Navigation.DropdownLink>
      )
      return nav
    })
    return nav
  }

  const getThemes = (links: DrupalMenuLinkContent[]|undefined) => {
    if (!links) {
      return <></>
    }
    const nav: ReactElement[] = []
    links.map((item: DrupalMenuLinkContent, index: number) => {
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

  const onSearch = (searchValue: string) => {
    router.push(`/search?q=${searchValue}`, undefined, { shallow: true })
  }

  return (
    <>
    <Navigation
      menuToggleAriaLabel="Menu"
      logoLanguage={locale === 'sv' ? 'sv' : 'fi'}
      skipTo="#content"
      skipToContentLabel="Skip to main content"
      title={t('site_name')}
      titleAriaLabel={t('navigation.title_aria_label')}
      titleUrl={locale === 'fi' ? '/' : `/${locale}`}
      className={classNames(styles.navigation, styles.zover)}
    >
      <Navigation.Row>
        {getNavi(menu)}
      </Navigation.Row>
      <Navigation.Actions>
        <Navigation.Search onSearch={onSearch} searchLabel={t('navigation.search_label')} searchPlaceholder={t('navigation.search_placeholder')} />
        <Navigation.User
          id='navigation_blue_button'
          key='navigation_button'
          label={t('navigation.button_text')}
          icon={<IconArrowTopRight size="l" />}
          onSignIn={() => {
            window.open(t('navigation.button_link'), '_blank')?.focus()
          }}
          className={styles.blueButton}
        />
        <Navigation.LanguageSelector label={locale.toUpperCase()}>
          <Navigation.Item
            lang="fi"
            key="fi_lang"
            href={langLinks.fi}
            hrefLang='fi'
            label="Suomeksi"
            active={langLinks.fi === activePath}
          />
          <Navigation.Item
            lang="sv"
            key="sv_lang"
            href={langLinks.sv}
            hrefLang='sv'
            label="På svenska"
            active={langLinks.sv === activePath}
          />
          <Navigation.Item
            lang="en"
            key="en_lang"
            href={langLinks.en}
            hrefLang='en'
            label="In English"
            active={langLinks.en === activePath}
          />
        </Navigation.LanguageSelector>
        {/* <Navigation.Dropdown
          label=""
          aria-label={t("navigation.theme_dropdown")}
          icon={<IconGlobe size='s' aria-label="Globe"/>}
          key='theme_dropdown'
          id='theme_dropdown'
        >
          {getThemes(themes)}
        </Navigation.Dropdown> */}
      </Navigation.Actions>
    </Navigation>
    {activePath !== '/' && (
      <div className={styles.subHeader}>
        <Breadcrumb breadcrumb={breadcrumb}/>
        {isPrintable && <PrintButton onClick={() => window?.print()} buttonText={t('text_print')}/>}
      </div>
      )}
    </>
  )
}

export default Header
