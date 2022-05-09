import { PreviewAlert } from 'src/components/PreviewAlert'
import { Container } from 'hds-react'
import styles from './layout.module.scss'
import Header from "@/components/navigation/Header"
import { HeaderProps } from "src/lib/types"

interface LayoutProps {
  children: any,
  header: HeaderProps,
}

export function Layout({ children, header }: LayoutProps): JSX.Element {
  return (
    <>
      <PreviewAlert />
      <div className={styles.wrapper}>
        <header>
          <Header {...header} />
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

