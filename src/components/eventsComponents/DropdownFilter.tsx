import { getAvailableTags } from '@/lib/helpers';
import { Combobox } from 'hds-react';
import { useEffect, useState } from 'react';


interface DropdownFilterProps {
    parameter: boolean;
    events: any;
    setFilter: (newFilter: any) => void; 
    selectedOptions: any;
    initialOptions: any;
}

function DropdownFilter({parameter, events, setFilter, selectedOptions, initialOptions}: DropdownFilterProps ) {
    const [domLoaded, setDomLoaded] = useState<boolean>(false);

    useEffect(() => {
      setDomLoaded(true);
    }, []);

  return (
    <div>
      {domLoaded && (
        <Combobox
          multiselect
          required
          label="Ohjauskieli"
          placeholder="Valitse ohjauskieli"
          isOptionDisabled={(option: any) => {
            return parameter
              ? !getAvailableTags(events, 'field_in_language').includes(
                  option.label
                )
              : false;
          }}
          onChange={(selectedOption) => {
            setFilter(selectedOption.map((option) => option.label));
          }}
          value={selectedOptions}
          options={initialOptions}
          clearButtonAriaLabel="Clear all selections"
          selectedItemRemoveButtonAriaLabel="Remove ${value}"
          toggleButtonAriaLabel="Toggle menu"
        />
      )}
    </div>
  );
}

export default DropdownFilter;
