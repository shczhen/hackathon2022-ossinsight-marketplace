import * as React from 'react';
import Box from '@mui/material/Box';

import Header from 'components/Layout/Header';
import SEO from 'components/Layout/Seo';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <>
      <Header />
      <SEO />
      <Box
        sx={{
          width: '100%',
          height: '100%',
          minHeight: 'calc(100vh - 4rem)',
          mt: '4rem',
        }}
      >
        {children}
      </Box>
    </>
  );
}
