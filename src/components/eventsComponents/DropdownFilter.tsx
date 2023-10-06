import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Combobox } from 'hds-react';

import { getAvailableTags } from '@/lib/helpers';
import styles from '../events/events.module.scss';

interface DropdownFilterProps {
  parameter: boolean;
  events: any;
  setFilter: (newFilter: any) => void;
  selectedOptions: any;
  initialOptions: any;
  filterLabel: string;
  dropdownLabel: string;
  filterField: string;
}

function DropdownFilter({
  parameter,
  events,
  setFilter,
  selectedOptions,
  initialOptions,
  filterLabel,
  dropdownLabel,
  filterField
}: DropdownFilterProps) {
  const { t } = useTranslation();
  const [domLoaded, setDomLoaded] = useState<boolean>(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    <div role="group" aria-label={t('search.group_description')}>
      {domLoaded && (
        <Combobox
          multiselect
          className={styles.dropdownFilter}
          label={t(dropdownLabel)}
          placeholder={t(filterLabel)}
          isOptionDisabled={(option: any) => {
            return parameter
              ? !getAvailableTags(events, filterField).includes(
                  option.label
                )
              : false;
          }}
          onChange={(selectedOption) => {
            setFilter(selectedOption.map((option) => option.label));
          }}
          value={selectedOptions}
          options={initialOptions}
          clearButtonAriaLabel={t('search.clear')}
          selectedItemRemoveButtonAriaLabel="Remove ${value}"
          toggleButtonAriaLabel="Toggle menu"
        />
      )}
    </div>
  );
}

export default DropdownFilter;
