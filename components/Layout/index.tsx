import * as React from 'react';
import Box from '@mui/material/Box';

import Header from 'components/Layout/Header';
import SEO from 'components/Layout/Seo';

export interface LayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export default function Layout(props: LayoutProps) {
  const { children, title, description } = props;
  return (
    <>
      <Header />
      <SEO title={title} description={description} />
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
