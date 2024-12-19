import { Button, IconLinkExternal, Navigation as NavigationHDS } from 'hds-react';
import { useTranslation } from 'next-i18next';

import { NavigationProps } from '@/lib/types';
import { primaryLanguages } from '@/lib/helpers';
import classNames from '@/lib/classNames';
import { getNav } from '../navigation/Header';
import styles from './navigationComponents.module.scss';
import LanguageSelect from './LanguageSelect';

export default function Navigation({
  locale,
  hideNav,
  menu,
  activePath,
  langLinks,
  onSearch,
  onClick,
  langcode,
  menuOtherLanguages,
  preview,
}: NavigationProps) {
  const { t } = useTranslation('common');
  return (
    <div className={styles.mainNav}>
      <NavigationHDS
        menuToggleAriaLabel="Menu"
        logoLanguage={locale === 'sv' ? 'sv' : 'fi'}
        skipTo="#content"
        skipToContentLabel={t('skip-to-main-content')}
        title={t('site_name')}
        titleAriaLabel={t('navigation.title_aria_label')}
        titleUrl={locale === 'fi' ? '/' : `/${locale}`}
        className={classNames(styles.navigation, styles.zover)}
      >
        <NavigationHDS.Actions>
          <LanguageSelect
            langLinks={langLinks}
            langcode={langcode}
            activePath={activePath}
            menuOtherLanguages={menuOtherLanguages}
            preview={preview}
          />
        </NavigationHDS.Actions>
        {primaryLanguages.includes(langcode) && !hideNav && (
          <NavigationHDS.Row>{getNav(menu, activePath, preview as boolean)}</NavigationHDS.Row>
        )}
      </NavigationHDS>
    </div>
  );
}
