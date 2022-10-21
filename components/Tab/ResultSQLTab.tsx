import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import BrowserOnlyReactJson from 'components/BrowserOnly/ReactJsonView';

const MOCK_SQL_RESULT_JSON = {
  data: [
    {
      id: 3121955081,
      type: 'PushEvent',
      created_at: '2015-09-06T04:14:43.000Z',
      repo_id: 41986369,
      repo_name: 'pingcap/tidb',
      actor_id: 878009,
      actor_login: 'ngaut',
      language: '',
      additions: 0,
      deletions: 0,
      action: '',
      number: 0,
      commit_id: '',
      comment_id: 0,
      org_login: 'pingcap',
      org_id: 11855343,
      state: '',
      closed_at: '1970-01-01T00:00:00.000Z',
      comments: 0,
      pr_merged_at: '1970-01-01T00:00:00.000Z',
      pr_merged: 0,
      pr_changed_files: 0,
      pr_review_comments: 0,
      pr_or_issue_id: 0,
      event_day: '2015-09-06T00:00:00.000Z',
      event_month: '2015-09-01T00:00:00.000Z',
      event_year: 2015,
      push_size: 2,
      push_distinct_size: 1,
      creator_user_login: '',
      creator_user_id: 0,
      pr_or_issue_created_at: '1970-01-01T00:00:00.000Z',
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
