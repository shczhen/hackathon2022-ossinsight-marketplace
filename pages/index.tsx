import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { readFileSync } from 'fs';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import ReviewsIcon from '@mui/icons-material/Reviews';

import Layout from 'components/Layout';
import { Pages } from 'lib/constants';
import 'github-markdown-css/github-markdown-light.css';

const Home: NextPage<{ source: MDXRemoteSerializeResult }> = (props: {
  source: MDXRemoteSerializeResult;
}) => {
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
        <Box className="markdown-body">
          <MDXRemote {...props.source} />
        </Box>
      </Container>
    </Layout>
  );
};

export async function getStaticProps() {
  // MDX text - can be from a local file, database, anywhere
  const srcMdContent = readFileSync('README.md', 'utf8').toString();
  // console.log(srcMdContent);
  // const source = 'Some **mdx** text, with a component <Heading />';
  const mdxSource = await serialize(srcMdContent);
  return { props: { source: mdxSource } };
}

export default Home;
