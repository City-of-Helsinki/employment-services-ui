import { Button, IconAlertCircleFill } from 'hds-react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import styles from './consentInfo.module.scss'

export default function ConsentInfo(): JSX.Element {
  const { t } = useTranslation('common')
  const { locale } = useRouter()

  return (
    <div className={styles.consentInfoWrapper}>
      <h3><IconAlertCircleFill /> {t('consent_info.title')}</h3>
      <p>{t('consent_info.text')}</p>
      <a href={locale === 'fi' ? '/cookies' : `/${locale}/cookies`}><Button variant="secondary">{t('consent_info.button')}</Button></a>
    </div>
  )
}