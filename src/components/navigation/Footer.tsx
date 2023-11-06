import React from 'react';
import {
  Footer as HDSFooter,
  IconArrowUp,
  IconFacebook,
  IconInstagram,
  IconLinkedin,
  Logo,
  logoFi,
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
        <HDSFooter.Link key={item.id} href={item.url} label={item.title} />
      );
    });
    return items;
  };

  return (
    <HDSFooter
      // logoLanguage={locale === 'sv' ? 'sv' : 'fi'}
      title={t('site_name')}
      theme={'dark'}
      className={styles.footer}
    >
      <HDSFooter.Navigation>
        {renderFooterNav(footerNav)}
        <HDSFooter.Link>
          <HDSFooter.Link
            icon={<IconFacebook size="m" aria-label={facebook} />}
            href="https://www.facebook.com/HelsinginTyollisyyspalvelut"
          />
          <HDSFooter.Link
            icon={<IconInstagram size="m" aria-label={instagram} />}
            href="https://www.instagram.com/helsingintyollisyyspalvelut"
          />
          <HDSFooter.Link
            icon={<IconLinkedin size="m" aria-label={linkedIn} />}
            href="https://www.linkedin.com/showcase/helsingintyollisyyspalvelut"
          />
        </HDSFooter.Link>
      </HDSFooter.Navigation>

      <HDSFooter.Base
      copyrightHolder="Copyright"
      copyrightText="All rights reserved"
      backToTopLabel="Back to top"
      logo={<Logo src={logoFi} size="medium" alt="Helsingin kaupunki" />}
      logoHref="https://hel.fi"
      onLogoClick={(event) => event.preventDefault()}
    >
      {/* <HDSFooter.Base copyrightHolder={t('footer.copyright')}
      logo={<Logo src={locale === 'sv' ? 'sv' : 'fi'} size="medium" alt="Helsingin kaupunki" />}
      > */}
        <HDSFooter.Link
          href={t('footer.accessibilityLink')}
          label={t('footer.accessibility')}
        />
        <HDSFooter.Link href={getCookiesUrl(locale)} label={t('footer.cookie_settings')} />
        <HDSFooter.Link
          className={styles.backToTopButton}
          onClick={scrollToTop}
          // label={
          //   <>
          //     {t('footer.goup')}
          //     <IconArrowUp aria-hidden="true" />
          //   </>
          // }
        />
      </HDSFooter.Base>
    </HDSFooter>
  );
}

export default Footer;
