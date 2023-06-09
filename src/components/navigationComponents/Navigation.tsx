import { Button, IconLinkExternal } from 'hds-react';
import { Navigation as NavigationHDS } from 'hds-react';
import { useTranslation } from 'next-i18next';

import { NavigationProps } from '@/lib/types';
import classNames from '@/lib/classNames';
import { getNav } from '../navigation/Header';
import styles from './navigationComponents.module.scss';
import LanguageSelect from './LanguageSelect';
import { primaryLanguages } from '@/lib/helpers';

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
          />
          {primaryLanguages.includes(langcode as string) && (
            <NavigationHDS.Search
              onSearch={onSearch}
              searchLabel={t('navigation.search_label')}
              searchPlaceholder={t('navigation.search_placeholder')}
            />
          )}
          <Button
            className={styles.loggingButton}
            onClick={onClick}
            iconRight={<IconLinkExternal size="s" aria-hidden="true" />}
          >
            {t('navigation.button_text')}
          </Button>
        </NavigationHDS.Actions>
        {primaryLanguages.includes(langcode as string) && !hideNav && (
          <NavigationHDS.Row>{getNav(menu, activePath)}</NavigationHDS.Row>
        )}
      </NavigationHDS>
    </div>
  );
}
