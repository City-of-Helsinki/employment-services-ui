import {
  IconAngleUp,
  IconAngleDown,
  Button,
  Card,
  useAccordion,
  Container,
} from 'hds-react';
import { Key } from 'react';

import styles from './accordion.module.scss';

interface AccordionProps {
  leftIcon: JSX.Element;
  accordionTitle: string;
  ariaLabel: string;
  backgroundColor: React.CSSProperties;
  group: string[];
  data: [
    {
      group: string;
      value: string;
    }
  ];
}

function AccordionWithIcon({
  leftIcon,
  accordionTitle,
  ariaLabel,
  backgroundColor,
  data,
  group,
}: AccordionProps): JSX.Element {
  const initiallyOpen = false;
  const { isOpen, buttonProps, contentProps } = useAccordion({ initiallyOpen });

  const icon = isOpen ? (
    <IconAngleUp size="l" aria-hidden />
  ) : (
    <IconAngleDown size="l" aria-hidden />
  );
  return (
    <Container className="container" style={backgroundColor}>
      <div className={styles.accordion}></div>
      <Button
        {...buttonProps}
        className={styles.iconAccordionButton}
        style={backgroundColor}
      >
        <div className={styles.iconAccordionHeaderText}>
          {leftIcon}
          <h3>{accordionTitle}</h3>
        </div>
        <div className={styles.iconAccordionHeaderIcon}>{icon}</div>
      </Button>
      <Card aria-label={ariaLabel} style={backgroundColor} {...contentProps}>
        {group.map(
          (groupName: {} | null | undefined, i: Key | null | undefined) => (
            <div key={i}>
              <h3>{groupName}</h3>
              <ul>
                {data
                  ?.filter((group) => groupName === group.group)
                  .map((value, i) => (
                    <li key={`${value.group}-${i}`}>{value.value}</li>
                  ))}
              </ul>
            </div>
          )
        )}
      </Card>
    </Container>
  );
}

export default AccordionWithIcon;
