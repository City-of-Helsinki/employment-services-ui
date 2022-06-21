import { PreviewAlert } from 'src/components/PreviewAlert'

import Header from '@/components/navigation/Header'
import Footer from '@/components/navigation/Footer'
import { NavProps, FooterProps } from "@/lib/types"

import styles from './layout.module.scss'

interface LayoutProps {
  children: any
  header: NavProps
  footer: FooterProps
}

export function Layout({ children, header, footer }: LayoutProps): JSX.Element {
  return (
    <>
      <PreviewAlert />
      <div className={styles.wrapper}>
        <Header {...header} />
        <main>{children}</main>
      </div>
      <Footer {...footer} />
    </>
  )
}

