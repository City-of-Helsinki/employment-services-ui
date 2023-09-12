import { PreviewAlert } from 'src/components/PreviewAlert';

import Header from '@/components/navigation/Header';
import Footer from '@/components/navigation/Footer';
import { NavProps, FooterProps } from '@/lib/types';

import styles from './layout.module.scss';

interface LayoutProps {
  children: any;
  header: NavProps;
  footer: FooterProps;
  hideNav?: boolean;
  langcode?: string | undefined;
  preview?: boolean;
}

export function Layout({
  children,
  header,
  footer,
  hideNav,
  langcode,
  preview,
}: LayoutProps): JSX.Element {
  return (
    <>
      <PreviewAlert />
      <div className={styles.wrapper}>
        <Header {...header} hideNav={hideNav} langcode={langcode as string}  preview={preview}/>
        <main>{children}</main>
      </div>
      <Footer {...footer} />
    </>
  );
}
