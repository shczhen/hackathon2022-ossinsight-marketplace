import * as React from 'react';
import ReactJson, { ReactJsonViewProps } from 'react-json-view';
import dynamic from 'next/dynamic';

const BrowserOnlyReactJson = (props: ReactJsonViewProps) => {
  // if (typeof window === 'undefined') {
  //   return null;
  // }
  // const ReactJson = require('react-json-view').default;
  // return <ReactJson {...props} />;

  const BrowserReactJsonView = dynamic(() => import('react-json-view'), {
    ssr: false,
  });

  return <BrowserReactJsonView {...props} />;
};

export default BrowserOnlyReactJson;
