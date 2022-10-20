import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Container from '@mui/material/Container';

import Layout from 'components/Layout';

const Home: NextPage = () => {
  return (
    <Layout>
      <Container maxWidth="xl">home page</Container>
    </Layout>
  );
};

export default Home;
