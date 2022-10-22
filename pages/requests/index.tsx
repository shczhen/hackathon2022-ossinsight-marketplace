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

export interface pluginItem {
  name: string;
  plugin: string;
  query: string;
  js: string;
  sql: string;
}

export default function RequestHomePage(props: { results: pluginItem[] }) {
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
            <Typography color="text.primary">Requests</Typography>
          </Breadcrumbs>

          {results.map((plugin) => {
            const pluginData = JSON.parse(plugin.plugin);
            return (
              <Box
                key={plugin.name}
                sx={{
                  height: 400,
                  width: 300,
                }}
              >
                <PluginCard
                  id={plugin.name}
                  title={pluginData.title}
                  desc={pluginData.description}
                  author={pluginData.author}
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
  const panels = readdirSync(join(BASE_PATH, 'configs/plugins/panels'));
  // console.log(panels);
  const results: pluginItem[] = [];
  panels.forEach((panel) => {
    const panelPath = join(BASE_PATH, 'configs/plugins/panels', panel);
    const pluginJsonStr = readFileSync(join(panelPath, 'plugin.json'));
    const queryJsonStr = readFileSync(join(panelPath, 'query.json'));
    const renderJsBuf = readFileSync(join(panelPath, 'render.js'));
    const templateSqlBuf = readFileSync(join(panelPath, 'template.sql'));
    results.push({
      name: panel,
      plugin: pluginJsonStr.toString(),
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
