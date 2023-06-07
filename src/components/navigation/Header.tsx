import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { DrupalMenuLinkContent } from 'next-drupal';
import { Navigation, IconArrowTopRight } from 'hds-react';

import { NavProps } from '@/lib/types';
import classNames from '@/lib/classNames';
import { printablePages } from '@/lib/helpers';
import { Breadcrumb } from './Breadcrumb';
import styles from './navigation.module.scss';
import PrintButton from '../printButton/PrintButton';

function Header(header: NavProps): JSX.Element {
  const { locale, menu, themes, langLinks, breadcrumb, hideNav } = header;
  const { t } = useTranslation('common');
  const router: any = useRouter(); // @TODO Fix type for proper
  const activePath = langLinks[locale ? locale : 'fi'];
  const [pageProps, setPageProps]: any | null = useState(null);
  const [isPrintable, setIsPrintable] = useState(false);

  useEffect(() => {
    setPageProps(router.components[router.route].props.pageProps);

    if (!pageProps || pageProps.node === undefined) return;

    if (printablePages.includes(pageProps.node.type)) {
      setIsPrintable(true);
    }
  }, [pageProps]);

  const getNav = (menuArray: DrupalMenuLinkContent[] | undefined) => {
    const nav: ReactElement[] = [];
    if (!menuArray) {
      return <></>;
    }
    menuArray.map((item: DrupalMenuLinkContent, index: number) => {
      const subs: ReactElement[] = [];
      let childActive = false;
      item.items?.map((sub: DrupalMenuLinkContent, i: number) => {
        const subUrl = sub.url;
        if (!subUrl.startsWith(`/${locale}/node` || '/node')) {
          subs.push(
            <Navigation.Item
              key={sub.title}
              as="a"
              href={sub.url}
              label={sub.title}
              active={sub.url === activePath}
            />
          );
        }
        return subs;
      });
      const isActive = item.url === activePath || childActive;
      const itemUrl = item.url;
      if (!itemUrl.startsWith(`/${locale}/node` || '/node')) {
        nav.push(
          <Navigation.DropdownLink
            label={item.title}
            key={item.title}
            id={item.title}
            active={isActive}
            className={classNames(
              styles.navDropDown,
              isActive && styles.active
            )}
            href={item.url}
          >
            {subs}
          </Navigation.DropdownLink>
        );
      }
      return nav;
    });
    return nav;
  };

  if (!menu && !themes && !langLinks) {
    return <></>;
  }

  const onSearch = (searchValue: string) => {
    router.push(`/search?q=${searchValue}`, undefined, { shallow: true });
  };

  return (
    <>
      <Navigation
        menuToggleAriaLabel="Menu"
        logoLanguage={locale === 'sv' ? 'sv' : 'fi'}
        skipTo="#content"
        skipToContentLabel={t('skip-to-main-content')}
        title={t('site_name')}
        titleAriaLabel={t('navigation.title_aria_label')}
        titleUrl={locale === 'fi' ? '/' : `/${locale}`}
        className={classNames(styles.navigation, styles.zover)}
      >
        {!hideNav && <Navigation.Row>{getNav(menu)}</Navigation.Row>}
        <Navigation.Actions>
          <Navigation.Search
            onSearch={onSearch}
            searchLabel={t('navigation.search_label')}
            searchPlaceholder={t('navigation.search_placeholder')}
          />
          <Navigation.User
            id="navigation_blue_button"
            key="navigation_button"
            label={t('navigation.button_text')}
            icon={<IconArrowTopRight size="l" />}
            onSignIn={() => {
              window.open(t('navigation.button_link'), '_blank')?.focus();
            }}
            className={styles.blueButton}
          />
          <Navigation.LanguageSelector
            label={locale && locale.toUpperCase()}
            buttonAriaLabel={t('lang-code')}
          >
            <Navigation.Item
              lang="fi"
              key="fi_lang"
              href={langLinks.fi}
              hrefLang="fi"
              label="Suomeksi"
              active={langLinks.fi === activePath}
            />
            <Navigation.Item
              lang="sv"
              key="sv_lang"
              href={langLinks.sv}
              hrefLang="sv"
              label="På svenska"
              active={langLinks.sv === activePath}
            />
            <Navigation.Item
              lang="en"
              key="en_lang"
              href={langLinks.en}
              hrefLang="en"
              label="In English"
              active={langLinks.en === activePath}
            />
          </Navigation.LanguageSelector>
        </Navigation.Actions>
      </Navigation>
      {activePath !== '/' && (
        <div className={styles.subHeader}>
          <Breadcrumb breadcrumb={breadcrumb} />
          {isPrintable && (
            <PrintButton
              onClick={() => window?.print()}
              buttonText={t('text_print')}
            />
          )}
        </div>
      )}
    </>
  );
}

export default Header;
