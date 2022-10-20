import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

type newAppProps = AppProps & {
  pageProps: {
    session: any;
    [key: string]: any;
  };
};

function MyApp({ Component, pageProps }: newAppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
