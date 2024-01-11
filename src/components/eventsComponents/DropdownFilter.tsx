import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Combobox } from 'hds-react';

import styles from '../events/events.module.scss';

interface DropdownFilterProps {
  setAvailableTags?: boolean;
  setFilter: (newFilter: any) => void;
  initialOptions: any;
  filterLabel: string;
  dropdownLabel: string;
  availableTags: string[];
  select: { id: string; name: string }[];
}

function DropdownFilter({
  setAvailableTags = true,
  setFilter,
  initialOptions,
  filterLabel,
  dropdownLabel,
  availableTags,
  select,
}: DropdownFilterProps) {
  const { t } = useTranslation();
  const [domLoaded, setDomLoaded] = useState<boolean>(false);
  const [currentOptionSelected, setCurrentOptionSelected] = useState<any>()

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  useEffect(() => {
    if (
      select.length === 0 &&
      currentOptionSelected !== undefined
    ) {
      setCurrentOptionSelected([]);
    } else {
      select?.map((option: any) => {
      setCurrentOptionSelected([{ value: option.id, label: option.name }]);
      });
    }

  }, [select]);

  return (
    <div role="group" aria-label={t('search.group_description')}>
      {domLoaded && (
        <Combobox
          multiselect
          clearable={true}
          className={styles.dropdownFilter}
          label={t(dropdownLabel)}
          placeholder={t(filterLabel)}
          isOptionDisabled={(option: any) => {
            return setAvailableTags
              ? !availableTags.includes(option.value)
              : false;
          }}
          onChange={(selectedOption: { label: string; value: string }[]) => {
            if (selectedOption.length > 1) {
              const lastSelected = selectedOption[selectedOption.length - 1];
              selectedOption.splice(0, selectedOption.length - 1);
              setFilter([{ id: lastSelected.value, name: lastSelected.label }]);
            } else if (selectedOption.length === 1) {
              setFilter([
                { id: selectedOption[0].value, name: selectedOption[0].label },
              ]);
            } else {
              setFilter([]);
            }
          }}
          value={currentOptionSelected}
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
