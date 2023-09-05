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
      <div>
        {`${t(getStartDateOfWeek)} ${dateformat(startDate, `dd.mm.yyyy`)}`}
        {!isSameDay &&
          ` - ${t(getEndDateOfWeek)} ${dateformat(endDate, 'ddd dd.mm.yyyy')},`}
        {` klo ${dateformat(startDate, 'HH:MM')} - ${dateformat(
          endDate,
          'HH:MM'
        )}`}
      </div>
    </>
  );
}

export default DateTimeSimple;
