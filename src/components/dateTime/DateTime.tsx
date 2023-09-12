import dateformat from 'dateformat'
import { IconCalendar, IconClock } from 'hds-react'

import styles from './dateTime.module.scss'

export interface DateTimeProps {
  startTime: number
  endTime: number
}

function DateTime(props: DateTimeProps): JSX.Element {
  const { startTime, endTime } = props

  const startDate = new Date(Number(startTime))
  const endDate = new Date(Number(endTime))

  const isSameDay =
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getDate() === endDate.getDate()

  return (
    <div className={styles.dateTime}>
      <div>
        <IconCalendar />
        <div>
          {`${dateformat(startDate, 'dd.mm.yyyy')}`}
          
          {!isSameDay && (
            ` - ${dateformat(endDate, 'dd.mm.yyyy')}`
          )}
        </div>
      </div>
      <div>
        <IconClock />
        {`${dateformat(startDate,'HH:MM')} - ${dateformat(endDate, 'HH:MM')}`}
      </div>
    </div>
  )
}

export default DateTime
