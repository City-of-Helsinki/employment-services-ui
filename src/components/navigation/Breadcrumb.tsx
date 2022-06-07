import { IconAngleRight, IconArrowRight } from "hds-react"
import Link from "next/link"
import { ReactElement } from "react"
import { useTranslation } from 'next-i18next'

import classNames from "@/lib/classNames"
import { BreadcrumbContent } from "@/lib/types"

import styles from './navigation.module.scss'

interface BreadcrumbProps {
  breadcrumb: BreadcrumbContent[]
}

export const Breadcrumb = ({breadcrumb}:BreadcrumbProps): JSX.Element => {
  const { t } = useTranslation('common')
  
  if (!breadcrumb || breadcrumb.length == 0) return <></>

  const crumbs: ReactElement[] = breadcrumb.map((crumb, index) => {
    if (index == breadcrumb.length-1) {
      return <li className={styles.breadcrumbElement} key={crumb.id}><span>{crumb.title}</span></li>
    }
    return (
      <li className={styles.breadcrumbElement} key={crumb.id}>
        <Link href={crumb.url}><a><span>{crumb.title}</span></a></Link><IconAngleRight size='s' />
      </li>
    )
  })

  return (
    <div className={classNames(styles.breadcrumb)}>
      <div className={styles.breadcrumbElement} key='breadcrumb-frontpage'>
        <Link href="/"><a><span>{t("navigation.frontpage")}</span></a></Link><IconAngleRight size='s' />
      </div>
      {crumbs}
    </div>
  )
}
