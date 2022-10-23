import * as React from 'react';
import Container from '@mui/material/Container';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

import { Pages } from 'lib/constants';
import Highlighter from 'components/Section/CodeSection';
import { panelItem } from 'pages/panels';
import Layout from 'components/Layout';
import PanelShareDialog from 'components/Dialog/PanelShareDialog';
import { QueryParameterItemType } from 'components/Section/RequestShare';

export default function RequestDetails(props: {
  id: string;
  title: string;
  data: panelItem;
  description: string;
  parameters: QueryParameterItemType[];
  chart?: React.ReactNode;
}) {
  const { id, title, data, description, parameters, chart } = props;

  return (
    <Layout
      title={`OssInsight Marketplace | Request Details`}
      description={description}
    >
      <Container maxWidth="xl">
        <Box paddingTop="2rem" paddingBottom="2rem">
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{
              paddingBottom: '2rem',
            }}
          >
            <Link href={Pages.Home}>Home</Link>
            <Link href={Pages.Panels}>My Panels</Link>
            <Typography color="text.primary">{title}</Typography>
          </Breadcrumbs>

          <Box>{chart}</Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '2rem',
            }}
          >
            <PanelShareDialog
              parameters={parameters}
              panelId={id}
              type="iframe"
              label="Share Iframe"
              title="Share this panel by iframe"
              description="Use this link as iframe src to share this panel with your friends."
            />
            <PanelShareDialog
              parameters={parameters}
              panelId={id}
              type="svg"
              label="Share SVG"
              title="Share this panel by SVG"
              description="Use this link as SVG src to share this panel with your friends."
            />
          </Box>

          <Typography variant="h4" component="h2" gutterBottom>
            Plugin Config
          </Typography>
          <Highlighter content={data.panel} language={['json']} />

          <Typography variant="h4" component="h2" gutterBottom>
            Query Config
          </Typography>
          <Highlighter content={data.query} language={['json']} />

          <Typography variant="h4" component="h2" gutterBottom>
            SQL Template
          </Typography>
          <Highlighter content={data.sql} language={['sql']} />

          <Typography variant="h4" component="h2" gutterBottom>
            Scripts
          </Typography>
          <Highlighter content={data.js} language={['javascripts']} />
        </Box>
      </Container>
    </Layout>
  );
}
