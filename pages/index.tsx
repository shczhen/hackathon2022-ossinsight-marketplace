import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import ReviewsIcon from '@mui/icons-material/Reviews';

import Layout from 'components/Layout';
import { Pages } from 'lib/constants';

const Home: NextPage = () => {
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
      </Container>
    </Layout>
  );
};

export default Home;
