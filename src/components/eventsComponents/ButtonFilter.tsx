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

  const handleFilterLang = (
    current: { id: string; name: string }[],
    tag: { id: string; name: string }
  ) => (current.findIndex((item) => item.id === tag.id) !== -1 ? [] : [tag]);

  const handleFilterEvent = (
    current: { id: string; name: string }[],
    tag: { id: string; name: string }
  ) => {
    const tagIndex = current.findIndex((item) => item.id === tag.id);
    return tagIndex !== -1
      ? [...current.slice(0, tagIndex), ...current.slice(tagIndex + 1)]
      : [...current, tag];
  };
  

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
            disabled={
              setAvailableTags ? !availableTags.includes(tag.id) : false
            }
            role="checkbox"
            aria-checked={Array.isArray(filter) && filter.map((tag: any) => tag.id).includes(tag.id)}
            aria-label={`${t(filterLabel)} ${tag.name.replace('_', ' ')}`}
            key={`tagFilter-${i}`}
            className={
              Array.isArray(filter) && filter?.map((tag: any) => tag.id).includes(tag.id) &&
              availableTags.includes(tag.id)
                ? styles.selected
                : styles.filterTag
            }
            onClick={() => {
              setFilter((current: { id: string; name: string }[]) =>
                filterLabel === 'search.filter_lang'
                  ? handleFilterLang(current, tag)
                  : handleFilterEvent(current, tag) 
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
