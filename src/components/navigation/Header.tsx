import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { DrupalMenuLinkContent } from 'next-drupal';
import { Navigation as NavigationHDS } from "hds-react";

import { FooterProps, NavProps, NavigationProps, Node } from '@/lib/types';
import classNames from '@/lib/classNames';
import {
  frontPagePaths,
  printablePages,
  previewNavigation,
  clearSessionStorage,
} from '@/lib/helpers';
import { Breadcrumb } from './Breadcrumb';
import styles from './navigation.module.scss';
import PrintButton from '../printButton/PrintButton';
import Navigation from '../navigationComponents/Navigation';
import MobileNavigation from '../navigationComponents/MobileNavigation';

interface RouterProps {
  components?: any;
  route: string;
  push: (searchValue: string, undefined: undefined, { shallow }: any) => void;
}

interface PageProps {
 footer: FooterProps;
 nav: NavigationProps;
 _nextI18Next: any;
 node: Node;
}

function Header(header: NavProps): JSX.Element {
  const {
    locale,
    menu,
    themes,
    langLinks,
    breadcrumb,
    hideNav,
    langcode,
    preview,
  } = header;
  const { t } = useTranslation('common');
  const router: RouterProps = useRouter();
  const activePath = langLinks[locale ?? 'fi'];
  const [pageProps, setPageProps] = useState<PageProps | null>(null);
  const [isPrintable, setIsPrintable] = useState<boolean>(false);

  useEffect(() => {
    setPageProps(router.components[router.route].props.pageProps);

    if (!pageProps || pageProps.node === undefined) return;

    if (printablePages.includes(pageProps.node.type)) {
      setIsPrintable(true);
    }
  }, [pageProps]);

  if (!menu && !themes && !langLinks) {
    return <></>;
  }

  const onSearch = (searchValue: string) => {
    router.push(`/search?q=${searchValue}`, undefined, { shallow: true });
  };

  const onClick = () => {
    window.open(t('navigation.button_link'), '_blank')?.focus();
  }

  return (
    <>
      <Navigation
        locale={locale}
        onSearch={onSearch}
        onClick={onClick}
        hideNav={hideNav}
        menu={menu}
        activePath={activePath}
        langLinks={langLinks}
        langcode={langcode as string}
        menuOtherLanguages={themes}
        preview={preview}
      />
      <MobileNavigation
        locale={locale}
        onSearch={onSearch}
        onSignIn={onClick}
        hideNav={hideNav}
        menu={menu}
        activePath={activePath}
        langLinks={langLinks}
        langcode={langcode as string}
        menuOtherLanguages={themes}
        preview={preview}
      />
    </>
  );
}

export default Header;

export const getNav = (menuArray: DrupalMenuLinkContent[] | undefined, activePath: any, preview: boolean) => {
  const nav: ReactElement[] = [];
  if (!menuArray) {
    return <></>;
  }
  return nav;
};
