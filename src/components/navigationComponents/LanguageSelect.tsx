import { useRef, useState } from 'react';
import { Button, IconAngleDown, IconAngleUp, IconGlobe, Link } from 'hds-react';
import { useTranslation } from 'next-i18next';

import { useBlur } from '@/hooks/useBlur';
import {
  primaryLanguages,
  languageFrontPages,
  previewNavigation,
  clearSessionStorage,
} from '@/lib/helpers';
import styles from './navigationComponents.module.scss';
import { LanguageSelect } from '@/lib/types';

function LanguageSelect({
  langLinks,
  activePath,
  langcode,
  menuOtherLanguages,
  preview,
}: LanguageSelect) {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState<boolean>(false);
  const wrapperRef = useRef(null);

  useBlur(wrapperRef, setOpen);

  return (
    <div>
      <nav
        className={styles.LanguageSelector}
        role="navigation"
        aria-label={t('choose_language')}
      >
        <div className={styles.languageSelect}>
          <Link
            aria-current={langLinks.fi === activePath}
            href={
              primaryLanguages.includes(langcode as string)
                ? langLinks.fi
                : languageFrontPages.fi
            }
            onClick={() => {
              previewNavigation(
                primaryLanguages.includes(langcode as string)
                  ? langLinks.fi
                  : languageFrontPages.fi,
                preview
              );
              clearSessionStorage();
            }}
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
            onClick={() => {
              previewNavigation(
                primaryLanguages.includes(langcode as string)
                  ? langLinks.sv
                  : languageFrontPages.sv,
                preview
              );
              clearSessionStorage();
            }}
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
            onClick={() => {
              previewNavigation(
                primaryLanguages.includes(langcode as string)
                  ? langLinks.en
                  : languageFrontPages.en,
                preview
              );
              clearSessionStorage();
            }}
          >
            English
          </Link>
          {langLinks.ru === activePath && activePath !== undefined && (
            <Link
              aria-current={langLinks.ru === activePath}
              href={langLinks.ru}
              onClick={() => {
                previewNavigation(langLinks.ru, preview);
                clearSessionStorage();
              }}
            >
              Русский
            </Link>
          )}
          {langLinks.so === activePath && activePath !== undefined && (
            <Link
              aria-current={langLinks.so === activePath}
              href={langLinks.so}
              onClick={() => {
                previewNavigation(langLinks.so, preview);
                clearSessionStorage();
              }}
            >
              Soomaali
            </Link>
          )}

          {langLinks.ua === activePath && activePath !== undefined && (
            <Link
              aria-current={langLinks.ua === activePath}
              href={langLinks.ua}
              onClick={() => {
                previewNavigation(langLinks.ua, preview);
                clearSessionStorage();
              }}
            >
              Українська
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}

export default LanguageSelect;
