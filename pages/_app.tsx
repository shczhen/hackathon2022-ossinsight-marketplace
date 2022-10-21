import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';

import { logger } from 'lib/swr';

type newAppProps = AppProps & {
  pageProps: {
    session: any;
    [key: string]: any;
  };
};

function MyApp({ Component, pageProps }: newAppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <SWRConfig value={{ use: [logger] }}>
        <Component {...pageProps} />
      </SWRConfig>
    </SessionProvider>
  );
}

export default MyApp;
