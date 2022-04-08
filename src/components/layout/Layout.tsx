import { PreviewAlert } from 'src/components/PreviewAlert'
import { Container } from 'hds-react'
import styles from './layout.module.scss'
import Nav from 'src/components/Nav'
import { DrupalMenuLinkContent } from "next-drupal"

interface LayoutProps {
  children: any,
  menu: DrupalMenuLinkContent[],
}

export function Layout({ children, menu }: LayoutProps): JSX.Element {
  return (
    <>
      <PreviewAlert />
      <div className={styles.wrapper}>
        <header>
          <div>
          <Nav menu={menu}/>
          </div>
        </header>
        <main>{children}</main>
        <footer>
          <Container className="container">
            <div className="columns">
              <div className="col col-6">
                Menu placeholder
              </div>
              <div className="col col-6">
                Oma asiointi placeholder
              </div>
            </div>
          </Container>
        </footer>
      </div>
    </>
  )
}

