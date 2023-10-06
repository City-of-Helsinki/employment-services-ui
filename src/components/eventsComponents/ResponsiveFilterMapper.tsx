import { useEffect, useState } from 'react';
import DropdownFilter from './DropdownFilter';
import ButtonFilter from './ButtonFilter';

interface ResponsiveFilterMapperProps {
  parameter: boolean;
  selectedOptions: any;
  events: any;
  setFilter: any;
  filter: any;
  initialOptions: any;
  tags: any;
  filterField: string;
  filterLabel: string;
  dropdownLabel: string;
}

function ResponsiveFilterMapper({
  parameter,
  events,
  selectedOptions,
  initialOptions,
  setFilter,
  filter,
  tags,
  filterField,
  filterLabel,
  dropdownLabel
}: ResponsiveFilterMapperProps) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (isMobile) {
    return (
      <DropdownFilter
        parameter={parameter}
        events={events}
        setFilter={setFilter}
        selectedOptions={selectedOptions}
        initialOptions={initialOptions}
        filterLabel={filterLabel}
        dropdownLabel={dropdownLabel}
        filterField={filterField}
      />
    );
  } else {
    return (
      <ButtonFilter
        tags={tags}
        events={events}
        setFilter={setFilter}
        filter={filter}
        filterField={filterField}
        filterLabel={filterLabel}
        parameter={parameter}
      />
    );
  }
}

export default ResponsiveFilterMapper;
