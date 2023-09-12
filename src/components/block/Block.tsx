import parse from 'html-react-parser';
import { IconClock, IconLocation, IconPhone, IconEnvelope } from 'hds-react';
import styles from '../pageTemplates/tprUnitPage.module.scss';

interface BlockProps {
  title: string;
  icon: string;
  content: any;
}

function Block(block: BlockProps) {
  const { title, icon, content } = block;
  const iconsMap: any = {
    location: IconLocation,
    clock: IconClock,
    phone: IconPhone,
    envelope: IconEnvelope,
  };
  const IconTag = iconsMap[icon];
  return (
    <div className={`${styles.infoBlock} onSidebar`}>
      <div className={styles.icon}>
        <IconTag aria-hidden="true" />
      </div>
      <div className={styles.blockContent}>
        <div className={styles.title}>{title}</div>
        <div className={styles.content}>
          <p>
            {parse(content.join('<br/>').replace(/(?:\r\n|\r|\n)/g, '<br/>'))}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Block;
