import * as React from 'react';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import Container from '@mui/material/Container';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

import Layout from 'components/Layout';
import PluginCard from 'components/Card/PluginCard';
import { Pages } from 'lib/constants';

export interface panelItem {
  name: string;
  panel: string;
  query: string;
  js: string;
  sql: string;
}

export default function RequestHomePage(props: { results: panelItem[] }) {
  const { results } = props;

  return (
    <Layout
      title="OssInsight Marketplace | My Request"
      description="List your own plugin here"
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
            <Typography color="text.primary">My Panels</Typography>
          </Breadcrumbs>

          {results.map((panel) => {
            const panelData = JSON.parse(panel.panel);
            return (
              <Box
                key={panel.name}
                sx={{
                  height: 400,
                  width: 300,
                }}
              >
                <PluginCard
                  id={panel.name}
                  title={panelData.title}
                  desc={panelData.description}
                  author={panelData.author}
                />
              </Box>
            );
          })}
        </Box>
      </Container>
    </Layout>
  );
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  // const res = await fetch('https://.../posts');
  // const posts = await res.json();
  const BASE_PATH = process.cwd();
  const panels = readdirSync(join(BASE_PATH, 'configs/panels'));
  // console.log(panels);
  const results: panelItem[] = [];
  panels.forEach((panel) => {
    const panelPath = join(BASE_PATH, 'configs/panels', panel);
    const panelJsonStr = readFileSync(join(panelPath, 'panel.json'));
    const queryJsonStr = readFileSync(join(panelPath, 'query.json'));
    const renderJsBuf = readFileSync(join(panelPath, 'render.js'));
    const templateSqlBuf = readFileSync(join(panelPath, 'template.sql'));
    results.push({
      name: panel,
      panel: panelJsonStr.toString(),
      query: queryJsonStr.toString(),
      js: renderJsBuf.toString(),
      sql: templateSqlBuf.toString(),
    });
  });

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      results,
    },
  };
}
