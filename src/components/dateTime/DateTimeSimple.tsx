import dateformat from 'dateformat';
import { useTranslation } from 'next-i18next';

export interface DateTimeProps {
  startTime: number;
  endTime: number;
}

function DateTimeSimple(props: DateTimeProps): JSX.Element {
  const { startTime, endTime } = props;
  const { t } = useTranslation();
  const startDate = new Date(Number(startTime));
  const endDate = new Date(Number(endTime));

  const isSameDay =
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getDate() === endDate.getDate();
  const getStartDateOfWeek = dateformat(startDate, `ddd`);
  const getEndDateOfWeek = dateformat(startDate, `ddd`);

  return (
    <>
      <div style={{ marginRight: '1.5rem' }}>
        {`${t(getStartDateOfWeek.toString())} ${dateformat(startDate, `dd.mm.yyyy`)}`}
        {!isSameDay &&
          ` - ${t(getEndDateOfWeek.toString())} ${dateformat(endDate, 'ddd dd.mm.yyyy')},`}
        {` ${t('datetime.time')} ${dateformat(startDate, 'HH:MM')} - ${dateformat(
          endDate,
          'HH:MM'
        )}`}
      </div>
    </>
  );
}

export default DateTimeSimple;
