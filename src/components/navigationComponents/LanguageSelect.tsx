import { useRef, useState } from 'react';
import { Button, IconAngleDown, IconAngleUp, IconGlobe, Link } from 'hds-react';
import { useTranslation } from 'next-i18next';

import { useBlur } from '@/hooks/useBlur';
import { primaryLanguages, languageFrontPages } from '@/lib/helpers';
import styles from './navigationComponents.module.scss';
import { LanguageSelect } from '@/lib/types';

function LanguageSelect({ langLinks, activePath, langcode }: LanguageSelect) {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState<boolean>(false);
  const wrapperRef = useRef(null);

  useBlur(wrapperRef, setOpen);

  return (
    <div>
      <nav className={styles.LanguageSelector} role="navigation" aria-label={t('choose_language')}>
        <div className={styles.languageSelect}>
          <Link
            aria-current={langLinks.fi === activePath}
            href={
              primaryLanguages.includes(langcode as string)
                ? langLinks.fi
                : languageFrontPages.fi
            }
          >
            Suomi
          </Link>
          <Link
            aria-current={langLinks.sv === activePath}
            href={
              primaryLanguages.includes(langcode as string)
                ? langLinks.sv
                : languageFrontPages.sv
            }
          >
            Svenska
          </Link>
          <Link
            aria-current={langLinks.en === activePath}
            href={
              primaryLanguages.includes(langcode as string)
                ? langLinks.en
                : languageFrontPages.en
            }
          >
            English
          </Link>
        </div>
        <div ref={wrapperRef}>
          <Button
            aria-label={t('other_languages')}
            className={styles.buttonGlobe}
            onClick={() => setOpen(!open)}
            iconRight={
              !open ? <IconAngleDown size="s" /> : <IconAngleUp size="s" />
            }
          >
            <IconGlobe size="s" />
          </Button>
          {open && (
            <div className={styles.globalDropDown}>
              <div className={styles.headerLanguageLink}>
                {t('global_menu_title')}
              </div>
              <a href={languageFrontPages.uk}>
                <div className={styles.globalLink}>
                  <span>Ukrainian</span>
                </div>
              </a>
              <a href={languageFrontPages.uk}>
                <div className={styles.globalLink}>
                  <span>Ukrainian</span>
                </div>
              </a>
              <a href={languageFrontPages.uk}>
                <div className={styles.globalLink}>
                  <span>Ukrainian</span>
                </div>
              </a>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default LanguageSelect;