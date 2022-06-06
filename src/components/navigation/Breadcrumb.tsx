import { DrupalMenuLinkContent } from "next-drupal";
import { ReactElement } from "react";

import styles from './navigation.module.scss'

interface BreadcrumbProps {
  breadcrumb: DrupalMenuLinkContent[]
}

export const Breadcrumb = ({breadcrumb}:BreadcrumbProps): JSX.Element => {
  if (!breadcrumb) return <></>

  const crumbs: ReactElement[] = breadcrumb.map((crumb) => {
    return (
      <li className={styles.breadcrumbElement} key={crumb.id}>
        <a href={crumb.url}>{crumb.title}</a>
      </li>
    )
  })
  return <ul className={styles.breadcrumb}>{crumbs}</ul>
}