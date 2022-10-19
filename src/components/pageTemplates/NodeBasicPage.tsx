import { Container } from 'hds-react'
import { NavProps, Node } from '@/lib/types'
import ContentMapper from '@/components/ContentMapper'
import { Sidebar } from '@/components/navigation/Sidebar'

interface NodeBasicPageProps {
  node: Node
  sidebar: NavProps
}

function NodeBasicPage({ node, sidebar, ...props }: NodeBasicPageProps): JSX.Element {
  // console.log({node})
  const { title, field_lead_in, field_content, field_notification, field_hide_sidebar, field_lower_content, langcode } = node

  return (
    <article>
      <Container className="container">
        <div className="columns">
          <div className={`content-region col col-8${!field_hide_sidebar ? " flex-grow" : "" }`}>
            {field_notification?.length > 0 && (
              <ContentMapper content={node.field_notification}/>
            )}
            <h1>{title}</h1>
            {field_lead_in && (
              <div className='lead-in'>{field_lead_in}</div>
            )}
            {field_content?.length > 0 && (
              <ContentMapper content={node.field_content} pageType='basic' />
            )}
          </div>
          {!field_hide_sidebar &&
          <div className="sidebar col col-4 flex-order-first">
            <Sidebar {...sidebar}/>
          </div>
          }
        </div>
        <div className="columns">
          <div className="lower-content-region col col-12">
            {field_lower_content?.length > 0 && (
              <ContentMapper content={node.field_lower_content} pageType='basic' langcode={langcode} />
            )}
          </div>
        </div>
      </Container>
    </article>
  )
}

export default NodeBasicPage
