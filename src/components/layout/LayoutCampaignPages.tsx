import { PreviewAlert } from 'src/components/PreviewAlert'

import Footer from '@/components/navigation/Footer'
import { FooterProps } from "@/lib/types"

import styles from './layout.module.scss'

interface LayoutProps {
  children: any
  footer: FooterProps
}

export function LayoutCampaignPages({ children, footer }: LayoutProps): JSX.Element {
  return (
    <>
      <PreviewAlert />
      <div className={styles.wrapper}>
        {/* <Header {...header} /> */}
        <main>{children}</main>
      </div>
      <Footer {...footer} />
    </>
  )
}
