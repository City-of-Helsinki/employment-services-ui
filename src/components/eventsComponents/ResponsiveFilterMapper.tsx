import { useEffect, useState } from 'react';

import DropdownFilter from './DropdownFilter';
import ButtonFilter from './ButtonFilter';
import { EventData } from '@/lib/types';

interface ResponsiveFilterMapperProps {
  setAvailableTags?: boolean;
  events: EventData[];
  setFilter: (newFilter: any) => void; 
  filter: string[];
  initialOptions: { label: string }[]
  selectedOptions: { label: string }[];
  tags: string[];
  filterField: string;
  filterLabel: string;
  dropdownLabel: string;
}

function ResponsiveFilterMapper({
  setAvailableTags = true,
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
        setAvailableTags={setAvailableTags}
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
        setAvailableTags={setAvailableTags}
      />
    );
  }
}

export default ResponsiveFilterMapper;
