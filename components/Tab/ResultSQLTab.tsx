import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import BrowserOnlyReactJson from 'components/BrowserOnly/ReactJsonView';

const MOCK_SQL_RESULT_JSON = {
  data: [
    {
      actor_login: 'tiancaiamao',
      comments: 9748,
    },
    {
      actor_login: 'zz-jason',
      comments: 9540,
    },
    {
      actor_login: 'coocood',
      comments: 8685,
    },
    {
      actor_login: 'shenli',
      comments: 8573,
    },
    {
      actor_login: 'zimulala',
      comments: 7382,
    },
  ],
};

export default function ResultSQLTab(props: any) {
  return (
    <Box>
      <Typography> finish in xx.x s</Typography>
      <BrowserOnlyReactJson src={MOCK_SQL_RESULT_JSON} />
    </Box>
  );
}
