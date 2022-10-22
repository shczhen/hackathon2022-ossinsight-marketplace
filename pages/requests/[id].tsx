import * as React from 'react';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import Container from '@mui/material/Container';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

import { pluginItem } from 'pages/requests';
import Layout from 'components/Layout';
import { Pages } from 'lib/constants';
import Highlighter from 'components/Section/CodeSection';

export default function RequestDetailsPage(props: { data: pluginItem }) {
  const { data } = props;
  const pluginData = JSON.parse(data.plugin);
  const { title, description, author } = pluginData;

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
            <Link href={Pages.Requests}>Requests</Link>
            <Typography color="text.primary">{title}</Typography>
          </Breadcrumbs>

          <Typography variant="h4" component="h2" gutterBottom>
            Plugin Config
          </Typography>
          <Highlighter content={data.plugin} language={['json']} />

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

          {/* {results.map((plugin) => {
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
          })} */}
        </Box>
      </Container>
    </Layout>
  );
}

// Generates `/iframe/1` and `/iframe/2`
export async function getStaticPaths() {
  // Query data and list all ids here!
  const BASE_PATH = process.cwd();
  const panels = readdirSync(join(BASE_PATH, 'configs/plugins/panels'));
  const paths = panels.map((panel) => ({
    params: { id: panel },
  }));
  return {
    paths,
    fallback: false, // can also be true or 'blocking'
  };
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps(context: { params: { id: string } }) {
  // Load ECharts options here!
  const BASE_PATH = process.cwd();
  const panels = readdirSync(join(BASE_PATH, 'configs/plugins/panels'));
  // console.log(panels);
  const panelPath = join(
    BASE_PATH,
    'configs/plugins/panels',
    context.params.id
  );
  const pluginJsonStr = readFileSync(join(panelPath, 'plugin.json'));
  const queryJsonStr = readFileSync(join(panelPath, 'query.json'));
  const renderJsBuf = readFileSync(join(panelPath, 'render.js'));
  const templateSqlBuf = readFileSync(join(panelPath, 'template.sql'));
  const results = {
    name: context.params.id,
    plugin: pluginJsonStr.toString(),
    query: queryJsonStr.toString(),
    js: renderJsBuf.toString(),
    sql: templateSqlBuf.toString(),
  };
  return {
    // Passed to the page component as props
    props: { data: results },
  };
}