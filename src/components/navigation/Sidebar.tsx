import { NavProps } from "@/lib/types";
import { IconArrowLeft, SideNavigation } from "hds-react";
import styles from './navigation.module.scss'

export function Sidebar(sidebar:NavProps): JSX.Element {
  const activePath = sidebar?.langLinks[sidebar?.locale]

  const getSideNavi = (menuArray: any) => {
    const nav: any = [];
    if (!menuArray) {
      return <></>
    }

    menuArray.map((item: any, index: number) => {
      const subs: any = []
      let parent: boolean = false

      item.items?.map((sub: any, i: number) => {
        if (sub.url === activePath) {
          parent = true;
        }
        if (sub.items) {
          let thirds: any = []
          sub.items?.map((third: any, idx: number) => {
            if (third.url === activePath) {
              parent = true;
            }
            thirds.push(
              <SideNavigation.SubLevel
                key={third.title}
                id={third.title}
                href={third.url}
                label={third.title}
                active={third.url === activePath}
              />
            )
            return thirds
          })
          subs.push(
            <SideNavigation.MainLevel
              key={sub.title}
              id={sub.title}
              href={sub.url} // this doesn't work
              label={sub.title}
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
              active={sub.url === activePath}
            />
          )
        }
        return subs
      })

      if (parent) {
        nav.push(
          <SideNavigation.MainLevel
            key={item.title}
            icon={<IconArrowLeft aria-hidden />}
            label={item.title}
            id={item.title}
            href={item.url}
          />
        , ...subs)
      }
      return nav
    })
    return nav
  }
  return (
    <SideNavigation
      defaultOpenMainLevels={[]}
      id="side-navigation"
      toggleButtonLabel="Navigate to page"
      className={styles.sidenav}
      // theme={{
      //   '--side-navigation-active-indicator-background-color': 'var(--color-metro)'
      // }}
    >
      {getSideNavi(sidebar?.menu)}
    </SideNavigation>
  )
}