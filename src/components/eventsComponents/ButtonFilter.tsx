import { Button } from 'hds-react';
import { useTranslation } from 'next-i18next';

import { getAvailableTags } from '@/lib/helpers';
import { EventData } from '@/lib/types';
import styles from '../events/events.module.scss';

interface ButtonFilterProps {
  tags: string[];
  events: EventData[];
  setFilter: (newFilter: any) => void; 
  filter: string[];
  filterField: string;
  filterLabel: string;
  setAvailableTags?: boolean;
}

function ButtonFilter({
    tags,
  events,
  setFilter,
  filter,
  filterField,
  filterLabel,
  setAvailableTags = true,
}: ButtonFilterProps) {
  const { t } = useTranslation();
  return (
    <div>
      <div className={styles.filter}>{t(filterLabel)}</div>
      <div
        role="group"
        aria-label={t('search.group_description')}
        className={styles.filterTags}
      >
        {tags?.map((tag:any, i: number) => (
          <Button
          value="value"
            disabled={
              setAvailableTags
                ? !getAvailableTags(events, filterField).includes(tag)
                : false
            }
            role="checkbox"
            aria-checked={filter.map((tag: any) => tag.name).includes(tag.name)}
            aria-label={`${t(filterLabel)} ${tag.name.replace('_', ' ')}`}
            key={`tagFilter-${i}`}
            className={
              filter.map((tag: any) => tag.name).includes(tag.name) &&
              getAvailableTags(events, filterField).includes(tag.name)
                ? styles.selected
                : styles.filterTag
            }
            onClick={() =>
              // setFilter((current: string[]) =>
              //   current?.includes(tag)
              //     ? [...current].filter(function (item) {
              //         return item !== tag;
              //       })
              //     : [...current, tag]
              // )
              setFilter([tag])
            }
          >
            {tag.name.replace('_', ' ')}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default ButtonFilter;
