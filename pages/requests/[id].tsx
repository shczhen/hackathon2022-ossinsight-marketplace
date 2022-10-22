import * as React from 'react';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import Container from '@mui/material/Container';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { pluginItem } from 'pages/requests';
import Layout from 'components/Layout';
import { Pages } from 'lib/constants';
import Highlighter from 'components/Section/CodeSection';
import RequestDetails from 'components/Section/RequestDetailsSection';
import RequestShare from 'components/Section/RequestShare';

export default function RequestDetailsPage(props: { data: pluginItem }) {
  const { data } = props;
  const panelData = JSON.parse(data.panel);
  const queryData = JSON.parse(data.query);
  const { title, description, author } = panelData;

  const router = useRouter();
  const { type } = router.query;

  return (
    <>
      {type === 'share' ? (
        <RequestShare params={queryData.params} sql={data.sql} js={data.js} />
      ) : (
        <RequestDetails title={title} data={data} description={description} />
      )}
    </>
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
