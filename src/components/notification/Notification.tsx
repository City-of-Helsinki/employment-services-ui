import React from "react"
import { Notification as HDSNotification } from "hds-react"
import { DrupalFormattedText } from "src/lib/types"
import HtmlBlock from "@/components/HtmlBlock"

interface NotificationProps {
  field_notification_title: string;
  field_notification_description: DrupalFormattedText;
}

function Notification(props: NotificationProps): JSX.Element {
  const { field_notification_title, field_notification_description } = props
  return (
    <div className="component">
      <HDSNotification label={field_notification_title}>
        {field_notification_description?.processed && (
          <HtmlBlock field_text={field_notification_description} />
        )}
      </HDSNotification>
    </div>
  );
}

export default Notification
