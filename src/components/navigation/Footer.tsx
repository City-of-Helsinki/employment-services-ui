import React from 'react';
import {
  Footer as HDSFooter,
  IconArrowUp,
  IconFacebook,
  IconInstagram,
  IconLinkedin,
} from 'hds-react';
import { useTranslation } from 'next-i18next';
import { DrupalMenuLinkContent } from 'next-drupal';

import { FooterProps } from '@/lib/types';
import styles from './navigation.module.scss';
import { getCookiesUrl } from '@/lib/helpers';

function Footer(props: FooterProps): JSX.Element {
  const { t } = useTranslation();
  const { locale, footerNav } = props;
  const instagram = `${t('site_name')} Instagram`;
  const facebook = `${t('site_name')} Facebook`;
  const linkedIn = `${t('site_name')} LinkedIn`;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const renderFooterNav = (nav: DrupalMenuLinkContent[] | undefined) => {
    if (!nav) return <></>;
    const items = nav.map((item) => {
      return (
        <HDSFooter.Item key={item.id} href={item.url} label={item.title} />
      );
    });
    return items;
  };

  return (
    <HDSFooter
      logoLanguage={locale === 'sv' ? 'sv' : 'fi'}
      title={t('site_name')}
      theme={'dark'}
      className={styles.footer}
    >

      <HDSFooter.Base copyrightHolder={t('footer.copyright')}>
        <HDSFooter.Item
          href={t('footer.accessibilityLink')}
          label={t('footer.accessibility')}
        />
        <HDSFooter.Item href={getCookiesUrl(locale)} label={t('footer.cookie_settings')} />
        <HDSFooter.Item
          className={styles.backToTopButton}
          onClick={scrollToTop}
          label={
            <>
              {t('footer.goup')}
              <IconArrowUp aria-hidden="true" />
            </>
          }
        />
      </HDSFooter.Base>
    </HDSFooter>
  );
}

export default Footer;
