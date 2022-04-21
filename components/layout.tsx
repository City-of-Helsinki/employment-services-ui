import Link from "next/link"

import { PreviewAlert } from "@/components/preview-alert"
import Header from "./navigation/Header"
import { DrupalMenuLinkContent } from "next-drupal"

import { HeaderProps } from "@/lib/types"


interface LayoutProps {
  children: any,
  header: HeaderProps,
}

export function Layout({ children, header }: LayoutProps): JSX.Element {
  console.log(header)
  return (
    <>
      <PreviewAlert />
      <div>
        <header>
          <div>
            <Link href="/" passHref>
              <a>
                Next.js for Drupal
              </a>
            </Link>
            <Header {...header} />
          </div>
        </header>
        <main>{children}</main>
      </div>
    </>
  )
}
