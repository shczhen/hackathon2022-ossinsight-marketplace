import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import BrowserOnlyReactJson from 'components/BrowserOnly/ReactJsonView';
import { QueryResult } from 'packages/db/db';

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

export default function ResultSQLTab(props: { data: QueryResult | null }) {
  const { data } = props;

  const { totalCost, isAP, data: result } = data || {};

  return (
    <Box>
      {data && (
        <Typography
          variant="body2"
          sx={{
            padding: '1rem 0',
          }}
        >{`Finished in ${totalCost}s. (AP ${
          isAP ? 'enabled' : 'disabled'
        })`}</Typography>
      )}
      <BrowserOnlyReactJson src={result || {}} />
    </Box>
  );
}
