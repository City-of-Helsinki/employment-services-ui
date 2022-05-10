import { NavProps } from "@/lib/types";
import { SideNavigation } from "hds-react";


export function Sidebar(sidebar:NavProps): JSX.Element {
  const activePath = sidebar?.langLinks[sidebar?.locale]

  const getSideNavi = (menuArray: any) => {
    const nav: any = [];
    if (!menuArray) {
      return <></>
    }

    menuArray.map((item: any, index: number) => {
      const subs: any = [];
      let parent: boolean = false;
      item.items?.map((sub: any, i: number) => {
        if (sub.items) {

        }
        if (sub.url === activePath) {
          parent = true;
        }
        subs.push(
          <SideNavigation.SubLevel
            id={sub.title}
            href={sub.url}
            label={sub.title}
            active={sub.url === activePath}
          />
        )
        return subs
      })
      if (parent) {
        nav.push(
          <SideNavigation.MainLevel label={item.title} id={item.title}>
            {subs}
          </SideNavigation.MainLevel>
        )
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
    >
      {getSideNavi(sidebar?.menu)}
    </SideNavigation>
  )
}