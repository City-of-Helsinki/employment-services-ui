import Head from 'next/head'
import { Container } from "hds-react";

import { Node, NavProps, FooterProps } from '@/lib/types'
import { NODE_TYPES } from "@/lib/drupalApiTypes";
import ConsentInfo from "../consentInfo/ConsentInfo";
import { Layout } from "../layout/Layout";
import NodeArticlePage from "../pageTemplates/NodeArticlePage";
import NodeBasicPage from "../pageTemplates/NodeBasicPage";
import NodeEventPage from "../pageTemplates/NodeEventPage";
import NodeLandingPage from "../pageTemplates/NodeLandingPage";
import NodeTprUnitPage from "../pageTemplates/NodeTprUnitPage";

interface PageProps {
  nav: NavProps;
  footer: FooterProps;
  metaDescription: string;
  metaTitle: string;
  metaUrl: string;
  metaImage: string;
  node: Node;
  rnsStatus: boolean;
}

function PageMapper({
  nav,
  footer,
  metaDescription,
  metaTitle,
  metaUrl,
  metaImage,
  node,
  rnsStatus,
}: PageProps) {
  return ( <Layout header={nav} footer={footer}>
    <Head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:image" content={metaImage} />
    </Head>
    { node.type === NODE_TYPES.PAGE && (
      <NodeBasicPage node={node} sidebar={nav} sidebarHidden={false} />
    )}
    { node.type === NODE_TYPES.LANDING_PAGE && (
      <NodeLandingPage node={node} />
    )}
    { node.type === NODE_TYPES.EVENT && (
      <NodeEventPage node={node} />
    )}
    { node.type === NODE_TYPES.ARTICLE && (
      <NodeArticlePage node={node} />
    )}
    { node.type === NODE_TYPES.TPR_UNIT && (
      <NodeTprUnitPage node={node} sidebar={nav} />
    )}
    {/* React and share */}
    <Container className="container hide-print">
      <div className="rns">
        {rnsStatus !== true ? <ConsentInfo /> : ''}
      </div>
    </Container>
    </Layout> );
}

export default PageMapper;
