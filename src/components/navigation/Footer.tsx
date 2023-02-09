import React, { ReactNode } from 'react'
import { Footer as HDSFooter, IconArrowUp } from  "hds-react"
import { useTranslation } from "next-i18next"
import { DrupalMenuLinkContent } from 'next-drupal'

import { FooterProps } from '@/lib/types'

import styles from './navigation.module.scss'

function Footer(props: FooterProps): JSX.Element {
  const { t } = useTranslation()
  const { locale, footerNav } = props

  const scrollToTop = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  const renderFooterNav = (nav: DrupalMenuLinkContent[]|undefined) => {
    if (!nav) return <></>
    const items = nav.map((item) => {
      return <HDSFooter.Item key={item.id} href={item.url} label={item.title} />
    })
    return items
  }

  return (
    <HDSFooter
      logoLanguage={locale === "sv" ? "sv" : "fi"}
      title={t('site_name')}
      theme={'dark'}
      className={styles.footer}
    >
      <HDSFooter.Navigation navigationAriaLabel="Footer navigation">
        {renderFooterNav(footerNav)}
      </HDSFooter.Navigation>
      <HDSFooter.Base copyrightHolder={t("footer.copyright")}>
        <HDSFooter.Item href={t("footer.accessibilityLink")} label={t("footer.accessibility")} />
        <HDSFooter.Item href={locale === 'fi' ? '/cookies' : `/${locale}/cookies`} label={t("footer.cookie_settings")} />
        <HDSFooter.Item
          className={styles.backToTopButton}
          onClick={(e: any) => scrollToTop(e)}
          label={<>{t("footer.goup")}<IconArrowUp aria-hidden="true" /></>}
        />
      </HDSFooter.Base>
    </HDSFooter>
  )
}

export default Footer