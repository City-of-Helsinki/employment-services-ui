import { useTranslation } from 'next-i18next';

import Block from '../block/Block';
import styles from '../pageTemplates/tprUnitPage.module.scss';

interface ContactInfoProps {
  aside?: boolean;
  phone: string;
  email: string;
  address: {
    address_line1: string;
    postal_code: number;
    locality: string;
  };
  address_postal: string;
  opening_hours: { value: string }[];
  call_charge_info: {
    format: string;
    processed: string;
    value: string;
  };
  service_map_embed: string;
}

function ContactInfo({
  aside,
  phone,
  email,
  address,
  address_postal,
  opening_hours,
  call_charge_info,
  service_map_embed,
}: ContactInfoProps) {
const { t } = useTranslation('common');
  return (
    <div className={`${styles.contactInfo} ${aside ? styles.aside : ''}`}>
      <div className={styles.contentTitle}>
        <span>{t('unit.contact_information')}</span>
      </div>
      {address.address_line1 && (
        <Block
          title={t('unit.visit_address')}
          icon="location"
          content={[
            address.address_line1,
            address.postal_code,
            address.locality,
          ]}
        />
      )}

      {opening_hours && (
        <Block
          title={t('unit.open_hours')}
          icon="clock"
          content={[opening_hours[0].value]}
        />
      )}

      {email && service_map_embed === '53341' && (
        <Block
          title={t('unit.email')}
          icon="envelope"
          content={[`<a href="mailto:${email}">${email}</a>`]}
        />
      )}

      {phone && (
        <Block
          title={t('unit.phone_service')}
          icon="phone"
          content={[`${phone} (${call_charge_info.value})`]}
        />
      )}

      {address_postal && (
        <Block
          title={t('unit.postal_address')}
          icon="location"
          content={[address_postal]}
        />
      )}
    </div>
  );
}

export default ContactInfo;
