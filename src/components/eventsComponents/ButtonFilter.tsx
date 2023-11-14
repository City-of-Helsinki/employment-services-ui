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
  language?: any;
  setSelectedLanguage?: any;
}

function ButtonFilter({
  tags,
  setFilter,
  filter,
  availableTags,
  filterLabel,
  setAvailableTags = true,
  language,
  setSelectedLanguage
}: ButtonFilterProps) {
  const { t } = useTranslation();
  const handleFilterLang = (
    current: { id: string; name: string }[],
    tag: { id: string; name: string }
  ) => {
    return current?.findIndex((item) => item.id === tag.id) !== -1 ? [] : [tag];
  };

  const handleFilterEvent = (
    current: { id: string; name: string }[],
    tag: { id: string; name: string }
  ) => {
    const tagIndex = current.findIndex((item) => item.id === tag.id);
    return tagIndex !== -1
      ? [...current.slice(0, tagIndex), ...current.slice(tagIndex + 1)]
      : [...current, tag];
  };

  const nameLang = `name_${language}`;

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
            aria-checked={
              Array.isArray(filter) &&
              filter.map((tag: any) => tag.id).includes(tag.id)
            }
            aria-label={`${t(filterLabel)} ${
              filterLabel === 'search.filter_lang'
                ? tag.name.replace('_', ' ')
                : tag[nameLang].replace('_', ' ')
            }`}
            key={`tagFilter-${i}`}
            className={
              Array.isArray(filter) &&
              filter?.map((tag: any) => tag.id).includes(tag.id) &&
              availableTags.includes(tag.id)
                ? styles.selected
                : styles.filterTag
            }
            onClick={() => {
              filterLabel === 'search.filter_lang'
                ? setSelectedLanguage(String(tag.id))
                : null;
              setFilter((current: { id: string; name: string }[]) =>
                filterLabel === 'search.filter_lang'
                  ? handleFilterLang(current, tag)
                  : handleFilterEvent(current, tag)
              );
            }}
          >
            {filterLabel === 'search.filter_lang'
              ? tag.name.replace('_', ' ')
              : tag[nameLang].replace('_', ' ')}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default ButtonFilter;
