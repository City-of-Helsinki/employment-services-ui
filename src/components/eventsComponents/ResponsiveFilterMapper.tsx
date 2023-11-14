import { useEffect, useState } from 'react';

import DropdownFilter from './DropdownFilter';
import ButtonFilter from './ButtonFilter';

interface ResponsiveFilterMapperProps {
  setAvailableTags?: boolean;
  setFilter: (newFilter: any) => void; 
  filter: [{ id: string; name: string }];
  initialOptions: { label: string }[]
  tags: string[];
  availableTags: string[];
  filterLabel: string;
  dropdownLabel: string;
  setSelectedLanguage: any;
}

function ResponsiveFilterMapper({
  setAvailableTags = true,
  initialOptions,
  setFilter,
  filter,
  tags,
  availableTags,
  filterLabel,
  dropdownLabel,
  setSelectedLanguage
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
      setFilter={setFilter}
      select={filter}
      initialOptions={initialOptions as { value: string; label: string }[]}
      filterLabel={filterLabel}
      dropdownLabel={dropdownLabel}
      availableTags={availableTags}
      setSelectedLanguage={setSelectedLanguage}
      />
    );
  } else {
    return (
      <ButtonFilter
        tags={tags}
        setFilter={setFilter}
        filter={filter}
        availableTags={availableTags}
        filterLabel={filterLabel}
        setAvailableTags={setAvailableTags}
        setSelectedLanguage={setSelectedLanguage}
      />
    );
  }
}

export default ResponsiveFilterMapper;