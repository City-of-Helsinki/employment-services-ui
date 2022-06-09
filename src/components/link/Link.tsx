import { IconArrowRight, IconArrowTopRight } from 'hds-react'
import { isExternalLink } from '@/lib/helpers'
import styles from './link.module.scss'

interface LinkProps {
  href: string
  text: string
  fullAreaLink?: boolean
}

function Link(props: LinkProps): JSX.Element {
  const { href, text, fullAreaLink } = props
  const iconSize = fullAreaLink ? 'l' : 'm'

  return (
    <a href={href} className={`${styles.link} ${fullAreaLink ? styles.fullAreaLink : '' } ${isExternalLink(href) ? styles.external : styles.internal }`}>
      <span>{text}</span>
      {isExternalLink(href) ? <IconArrowTopRight size={iconSize} /> : <IconArrowRight size={iconSize} />}
    </a>
  )
}

export default Link
