import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import useSWR from 'swr';
import { IconArrowRight, Container } from 'hds-react';

import { getUnits } from '@/lib/client-api';
import { getPathAlias, sortArrayByOtherArray } from '@/lib/helpers';
import { NavProps } from '@/lib/types';
import MediaImage from '../mediaImage/MediaImage';
import styles from './units.module.scss';

interface MenuItemFilterProperties {
  menuContactInfo: string;
  subMenuOffice: string;
}

interface Units {
  id: string;
  picture_url_override: string;
  picture_url: string;
  address: {
    address_line1: string;
    postal_code: number;
    locality: string;
  };
  name_override: string;
  name: string;
  path: {
    alias: string;
    langcode: string;
    pid: string;
  }
}

function UnitsList(sidebar: NavProps): JSX.Element {
  const [offices, setOffices] = useState<string[]>([]);
  const [menuFilters, setMenuFilters] = useState<MenuItemFilterProperties>({
    menuContactInfo: '',
    subMenuOffice: '',
  });
  const { t } = useTranslation();
  const { locale } = useRouter();
  const fetcher = () => getUnits(locale ?? 'fi');
  const { data: units } = useSWR(`/units`, fetcher);

  const getFilterValues = useCallback(() => {
    let filterValues;
    switch (locale) {
      case 'en':
        filterValues = {
          menuContactInfo: 'Contact information',
          subMenuOffice: 'Offices',
        };
        break;
      case 'sv':
        filterValues = {
          menuContactInfo: 'Kontaktuppgifter',
          subMenuOffice: 'Verksamhetsställen',
        };
        break;
      default:
        filterValues = {
          menuContactInfo: 'Yhteystiedot',
          subMenuOffice: 'Toimipisteet',
        };
    }
    return filterValues;
  }, [locale]);

  const getOfficeOrderFromMenu = (
    menu: any,
    mainMenu: string | null,
    subMenu: string | null
  ) => {
    const officeList: string[] = [];
    menu
      ?.filter(
        (menuItems: { title: string | null }) => menuItems.title === mainMenu
      )
      .map((menuItem: { items: any[] }) =>
        menuItem.items?.filter(
          (subMenuItems: { title: string | null }) =>
            subMenuItems.title === subMenu
        )
      )
      .map((subMenuItem: { items: any[] }[]) =>
        subMenuItem?.map((offices: { items: any[] }) =>
          offices.items?.map((office: { title: string }) =>
            officeList.push(office.title)
          )
        )
      );
    return officeList;
  };

  useEffect(() => {
    setMenuFilters(getFilterValues());
    setOffices(
      getOfficeOrderFromMenu(
        sidebar?.menu,
        menuFilters.menuContactInfo,
        menuFilters.subMenuOffice
      )
    );
  }, [
    sidebar?.menu,
    locale,
    getFilterValues,
    menuFilters.menuContactInfo,
    menuFilters.subMenuOffice,
  ]);

  return (
    <div className="component">
      <Container className="container">
        <div className={styles.unitsList}>
          {units &&
            sortArrayByOtherArray(units, offices)?.map(
              (unit: Units) => (
                <div key={unit.id} className={styles.card}>
                  <div className={styles.media}>
                    <MediaImage
                      media={
                        unit.picture_url_override
                          ? unit.picture_url_override
                          : unit.picture_url
                      }
                    />
                  </div>
                  <div className={styles.description}>
                    <h3>
                      {unit.name_override ? unit.name_override : unit.name}
                    </h3>
                    <p>
                      {`${
                        unit.address.address_line1
                          ? unit.address.address_line1 + ', '
                          : ''
                      }`}
                      {`${
                        unit.address.postal_code
                          ? unit.address.postal_code + ', '
                          : ''
                      }`}
                      {`${unit.address.locality ? unit.address.locality : ''}`}
                    </p>
                    <div className={styles.link}>
                      <a href={getPathAlias(unit.path)}></a>
                      <span>{t('unit.more_info')}</span>
                      <IconArrowRight />
                    </div>
                  </div>
                </div>
              )
            )}
        </div>
      </Container>
    </div>
  );
}

export default UnitsList;
