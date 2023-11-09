import { useTranslation } from 'next-i18next';
import { Button } from 'hds-react';

import styles from '../events/events.module.scss';

interface ButtonFilterProps {
  tags: string[];
  setFilter: (newFilter: any) => void;
  filter: [{ name: string; id: string }];
  availableTags: any;
  filterLabel: string;
  setAvailableTags?: any;
}

function ButtonFilter({
  tags,
  setFilter,
  filter,
  availableTags,
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
        {tags?.map((tag: any, i: number) => (
          <Button
            disabled={setAvailableTags ? !availableTags.includes(tag.id) : false}
            role="checkbox"
            aria-checked={filter.map((tag: any) => tag.id).includes(tag.id)}
            aria-label={`${t(filterLabel)} ${tag.name.replace('_', ' ')}`}
            key={`tagFilter-${i}`}
            className={
              filter.map((tag: any) => tag.id).includes(tag.id) &&
              availableTags.includes(tag.id)
                ? styles.selected
                : styles.filterTag
            }
            onClick={() => {
              setFilter((current: string[]) =>
                filterLabel === 'search.filter_lang' && !(current?.includes(tag))
                  ? [tag]
                  : current?.includes(tag)
                  ? current.filter((item) => item !== tag)
                  : [...current, tag]
              );
            }}
          >
            {tag.name.replace('_', ' ')}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default ButtonFilter;
