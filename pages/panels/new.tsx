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
      title="OssInsight Marketplace | New Request"
      description="Create your own plugin here"
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
            <Typography color="text.primary">Create New Request</Typography>
          </Breadcrumbs>

          <NewRequest />
        </Box>
      </Container>
    </Layout>
  );
};

export default NewRequestPage;
