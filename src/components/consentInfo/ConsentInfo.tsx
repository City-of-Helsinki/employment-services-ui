import { useEffect, useState } from 'react';
import { Button, IconAlertCircleFill } from 'hds-react';
import { useTranslation } from 'next-i18next';
import router, { useRouter } from 'next/router';

import styles from './consentInfo.module.scss';
import { getCookiesUrl } from '@/lib/helpers';

export default function ConsentInfo(): JSX.Element {
  const { t } = useTranslation('common');
  const { locale } = useRouter();
  const [cookiesUrl, setCookiesUrl] = useState('/cookies');

  useEffect(() => {
    setCookiesUrl(getCookiesUrl(locale as string));
  }, [locale]);

  return (
    <div className={styles.consentInfoWrapper}>
      <h3>
        <IconAlertCircleFill /> {t('consent_info.title')}
      </h3>
      <p>{t('consent_info.text')}</p>
      <Button type="button" onClick={() => router.push(cookiesUrl)}>
        {t('consent_info.button')}
      </Button>
    </div>
  );
}
