import { Header, IconSearch, IconUser, Link, Logo, logoFi, logoSv, logoSvDark } from 'hds-react';
import { useTranslation } from 'next-i18next';

import { NavigationProps } from '@/lib/types';
import { primaryLanguages } from '@/lib/helpers';
import classNames from '@/lib/classNames';
import { getNav } from '../navigation/Header';
import styles from './navigationComponents.module.scss';
import LanguageSelect from './LanguageSelect';
import React from 'react';

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


  

    const languages = [
      { label: 'Suomi', value: 'fi', isPrimary: true },
      { label: 'Svenska', value: 'sv', isPrimary: true },
      { label: 'English', value: 'en', isPrimary: true },
      { label: 'Français', value: 'fr' },
    ]



    const searchAction = () => {
      console.log('Open search page');
    };
  
    const [href, setHref] = React.useState('');
    const [lang, setLang] = React.useState('fi');
  
    const languageChangedStateAction = (language: React.SetStateAction<string>) => {
      setLang(language);
    };
  
    const [I18n, setI18n] = React.useState(lang);
  
    React.useEffect(() => {
      setI18n(lang);
    }, [lang]);
  return (
    <div className={styles.mainNav}>


      {/* <NavigationHDS
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
          {primaryLanguages.includes(langcode) && (
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
        {primaryLanguages.includes(langcode) && !hideNav && (
          <NavigationHDS.Row>{getNav(menu, activePath, preview as boolean)}</NavigationHDS.Row>
        )}
      </NavigationHDS> */}
  
113   
    </div>
  );
}