import { Navigation } from 'hds-react';
import { useTranslation } from 'next-i18next';

import styles from './navigationComponents.module.scss';
import classNames from '@/lib/classNames';
import { NavigationProps } from '@/lib/types';
import LanguageSelect from './LanguageSelect';
import { getNav } from '../navigation/Header';
import { primaryLanguages } from '@/lib/helpers';

export default function MobileNavigation({
  locale,
  onSearch,
  hideNav,
  menu,
  activePath,
  langLinks,
  langcode,
  onSignIn,
  menuOtherLanguages,
  preview
}: NavigationProps) {
  const { t } = useTranslation('common');
  return (
    <div className={styles.mobileNav}>
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
        <Navigation.Actions>
          {primaryLanguages.includes(langcode) && (
            <Navigation.Search
              onSearch={onSearch}
              searchLabel={t('navigation.search_label')}
              searchPlaceholder={t('navigation.search_placeholder')}
            />
          )}
          <Navigation.User
            id="navigation_blue_button"
            key="navigation_button"
            label={t('navigation.button_text')}
            onSignIn={onSignIn}
            className={styles.blueButton}
          />
        </Navigation.Actions>
        {primaryLanguages.includes(langcode) && !hideNav && (
          <Navigation.Row>{getNav(menu, activePath, preview as boolean)}</Navigation.Row>
        )}
      </Navigation>
      <LanguageSelect
        langLinks={langLinks}
        activePath={activePath}
        langcode={langcode}
        menuOtherLanguages={menuOtherLanguages}
        preview={preview}
      />
    </div>
  );
}
