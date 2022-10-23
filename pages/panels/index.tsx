import * as React from 'react';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import Container from '@mui/material/Container';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import Layout from 'components/Layout';
import PluginCard from 'components/Card/PluginCard';
import { Pages } from 'lib/constants';
import axios from 'lib/axios';
import { BasicCardSkeleton } from 'components/Card/PluginCard';

export interface panelItem {
  panelData?: any;
  name: string;
  panel: string;
  query: string;
  js: string;
  sql: string;
}

export default function RequestHomePage(props: { results: panelItem[] }) {
  const { results } = props;

  const [userLogin, setUserLogin] = React.useState('');
  const [filteredResult, setFilteredResult] = React.useState<panelItem[]>([]);

  const { data: session, status } = useSession();

  React.useEffect(() => {
    const getLogin = async () => {
      try {
        const data = await axios.get('/api/github/me').then((res) => res.data);
        console.log(data);
        const { login } = data;
        setUserLogin(login);
      } catch (error: any) {
        console.error(error);
        setUserLogin('');
      }
    };
    if (session) {
      getLogin();
    }
  }, [session]);

  React.useEffect(() => {
    if (userLogin) {
      const filtered = results
        .map((i) => ({
          ...i,
          panelData: JSON.parse(i.panel),
        }))
        .filter((i) => i.panelData?.author?.includes(userLogin));
      setFilteredResult(filtered);
    }
  }, [results, userLogin]);

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

          <Grid container spacing={2}>
            {filteredResult.map((panel) => {
              const panelData = panel.panelData;
              return (
                <Grid key={panel.name} xs={6} md={4} xl={3}>
                  <PluginCard
                    id={panel.name}
                    title={panelData.title}
                    desc={panelData.description}
                    author={panelData.author}
                  />
                </Grid>
              );
            })}
          </Grid>
          {filteredResult.length === 0 && userLogin && (
            <Typography variant="body2">Empty</Typography>
          )}

          {status === 'loading' && !userLogin && (
            <Box
              sx={{
                height: 400,
                width: 300,
              }}
            >
              <BasicCardSkeleton />
            </Box>
          )}
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
