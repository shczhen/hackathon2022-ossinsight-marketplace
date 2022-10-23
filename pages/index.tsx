import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import ReviewsIcon from '@mui/icons-material/Reviews';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import Layout from 'components/Layout';
import { Pages } from 'lib/constants';
import 'github-markdown-css/github-markdown-light.css';
import { panelItem } from 'pages/panels';
import PluginCard from 'components/Card/PluginCard';

const Home: NextPage<{ results: panelItem[] }> = (props: {
  results: panelItem[];
}) => {
  const { results } = props;

  const router = useRouter();

  return (
    <Layout
      title="OssInsight Marketplace | Home"
      description="OssInsight Marketplace home page"
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            padding: '2rem 0',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <Button
              variant="contained"
              startIcon={<ReviewsIcon fontSize="inherit" />}
              onClick={() => router.push(Pages.Panels)}
            >
              View my panels
            </Button>
            <Button
              variant="contained"
              startIcon={<LibraryAddIcon fontSize="inherit" />}
              onClick={() => router.push(Pages.Newpanel)}
            >
              Create
            </Button>
          </Box>
        </Box>
        {/* <Box className="markdown-body">
          <MDXRemote {...props.source} />
        </Box> */}
        <Grid container spacing={2}>
          {results.map((panel) => {
            const panelData = JSON.parse(panel.panel);
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
      </Container>
    </Layout>
  );
};

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

export default Home;
