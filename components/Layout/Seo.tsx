import * as React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';

export interface SEOProps {
  title: string;
  description: string;
}

export default function SEO(props: SEOProps) {
  const { title, description } = props;
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
