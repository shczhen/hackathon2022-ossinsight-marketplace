import * as React from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import { Pages } from 'lib/constants';
import Layout from 'components/Layout';
import NewRequest from 'components/Section/NewRequest';

const NewRequestPage: NextPage = () => {
  return (
    <Layout
      title="OssInsight Marketplace | New Panel"
      description="Create your own panel here"
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
            <Typography color="text.primary">Create New Panel</Typography>
          </Breadcrumbs>

          <NewRequest />
        </Box>
      </Container>
    </Layout>
  );
};

export default NewRequestPage;
