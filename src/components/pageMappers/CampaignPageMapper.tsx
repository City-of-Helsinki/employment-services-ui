import { NODE_TYPES } from '@/lib/drupalApiTypes'
import { Node, FooterProps } from '@/lib/types'
import Head from 'next/head'
import { Container } from 'hds-react'
import ConsentInfo from '../consentInfo/ConsentInfo'
import { LayoutCampaignPages } from '../layout/LayoutCampaignPages'
import NodeBasicPage from '../pageTemplates/NodeBasicPage'
import NodeLandingPage from '../pageTemplates/NodeLandingPage'

interface CampaignPageProps {
  footer: FooterProps
  metaDescription: string
  metaTitle: string
  metaUrl: string
  metaImage: string
  node: Node
  rnsStatus: boolean
}

function CampaignPageMapper({
  footer,
  metaDescription,
  metaTitle,
  metaUrl,
  metaImage,
  node,
  rnsStatus,
}: CampaignPageProps): JSX.Element {
  return (
    <LayoutCampaignPages footer={footer}>
      <Head>
        <title>{metaTitle}</title>
        <meta name='description' content={metaDescription} />
        <meta property='og:title' content={metaTitle} />
        <meta property='og:description' content={metaDescription} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={metaUrl} />
        <meta property='og:image' content={metaImage} />
      </Head>
      {/* Skip to main content point */}
      <a id='content' tabIndex={-1}></a>
      {node.type === NODE_TYPES.LANDING_PAGE && <NodeLandingPage node={node} />}
      {node.type === NODE_TYPES.PAGE && (
        <NodeBasicPage node={node} sidebarHidden={true} />
      )}
      {/* React and share */}
      <Container className='container hide-print'>
        <div className='rns'>{rnsStatus !== true ? <ConsentInfo /> : ''}</div>
      </Container>
    </LayoutCampaignPages>
  )
}

export default CampaignPageMapper
