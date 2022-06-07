import classNames from "@/lib/classNames"
import { NavProps } from "@/lib/types"
import { IconArrowLeft, SideNavigation } from "hds-react"
import styles from './navigation.module.scss'
import { useTranslation } from 'next-i18next'
import { ReactElement } from "react"
import { DrupalMenuLinkContent } from "next-drupal"

export function Sidebar(sidebar:NavProps): JSX.Element {

  const { locale, menu, langLinks } = sidebar
  const { t } = useTranslation('common')

  const activePath = langLinks[locale]

  const getSideNavi = (menuArray: DrupalMenuLinkContent[]|undefined):{ nav: ReactElement[], defaultOpenMainLevels: number[] } => {
    const nav: ReactElement[] = [];
    let defaultOpenMainLevels: number[] = [];

    if (!menuArray) {
      return {nav, defaultOpenMainLevels}
    }
    menuArray.map((second: DrupalMenuLinkContent, index: number) => {
      const subs: ReactElement[] = []
      let parent: boolean = false

      second.items?.map((sub: DrupalMenuLinkContent, i: number) => {
        if (sub.url === activePath) {
          parent = true;
          defaultOpenMainLevels.push(i+1)
        }
        if (sub.items) {
          let thirds: ReactElement[] = []
          sub.items?.map((third: DrupalMenuLinkContent, idx: number) => {
            if (third.url === activePath) {
              parent = true;
            }
            thirds.push(
              <SideNavigation.SubLevel
                key={third.title}
                id={third.title}
                href={third.url}
                label={third.title}
                className={classNames(styles.subLevel, third.url === activePath && styles.active)}
                active={third.url === activePath}
              />
            )
            return thirds
          })
          subs.push(
            <SideNavigation.MainLevel
              key={sub.title}
              id={sub.title}
              // href={sub.url}
              onClick={() => window.location.href = sub.url}
              label={sub.title}
              className={classNames(styles.mainLevel, sub.url === activePath && styles.active)}
              active={sub.url === activePath}
            >
              {thirds}
            </SideNavigation.MainLevel>
          )
        }
        else {
          subs.push(
            <SideNavigation.MainLevel
              key={sub.title}
              id={sub.title}
              href={sub.url}
              label={sub.title}
              className={classNames(styles.mainLevel, sub.url === activePath && styles.active)}
              active={sub.url === activePath}
            />
          )
        }
        return subs
      })

      if (parent || second.url === activePath) {
        nav.push(
          <SideNavigation.MainLevel
            key={second.title}
            icon={<IconArrowLeft aria-hidden />}
            label={second.title}
            id={second.title}
            href={second.url}
            className={classNames(styles.topLevel)}

          />
        , ...subs)
      }
      return nav
    })
    return {nav, defaultOpenMainLevels}
  }
  const {nav, defaultOpenMainLevels} = getSideNavi(menu)

  return (
    <SideNavigation
      defaultOpenMainLevels={defaultOpenMainLevels}
      id="side-navigation"
      toggleButtonLabel={t('navigation.navigate_to_page')}
      className={styles.sidenav}
    >
      {nav}
    </SideNavigation>
  )
}
