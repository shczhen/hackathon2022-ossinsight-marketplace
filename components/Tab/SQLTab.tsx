import * as React from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Editor from '@monaco-editor/react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReactJson, { ReactJsonViewProps } from 'react-json-view';

const PLACEHOLDER = `/*
Playground uses LIMITED resource(cpu/mem), so SQL should add:

  WHERE repo_id = 41986369

to use index as much as possible, or it will be terminated.


Example:

SELECT
  *
FROM
  github_events
WHERE
  repo_id = {{{repoId}}
LIMIT
  1;
*/`;

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

// export default function SQLStep(props: any) {
//   const [sql, setSql] = React.useState('');

//   const handleEditorValueChange = (value: string | undefined) => {
//     // console.log(value);
//   };

//   return (
//     <Box
//       sx={{
//         padding: '2rem 0',
//       }}
//     >
//       <Typography component="h2" variant="h4" paddingBottom="2rem">
//         Customize your SQL
//       </Typography>
//       <Box
//         sx={{
//           height: '30vh',
//           minHeight: 500,
//           display: 'flex',
//           flexDirection: 'row',
//           gap: '2rem',
//         }}
//       >
//         <Box
//           sx={{
//             height: '100%',
//             width: 'calc(50% - 1rem)',
//           }}
//         >
//           <Editor
//             height="100%"
//             theme="vs-dark"
//             defaultLanguage="mysql"
//             defaultValue={PLACEHOLDER}
//             onChange={handleEditorValueChange}
//           />
//         </Box>
//         <Box
//           sx={{
//             height: '100%',
//             width: 'calc(50% - 1rem)',
//             overflow: 'auto',
//           }}
//         >
//           <Button
//             variant="contained"
//             disabled={!sql}
//             startIcon={<PlayArrowIcon fontSize="inherit" />}
//             sx={{
//               marginBottom: '1rem',
//             }}
//           >
//             Run
//           </Button>
//           <BrowserOnlyReactJson src={MOCK_SQL_RESULT_JSON} />
//         </Box>
//       </Box>
//     </Box>
//   );
// }

export default function SQLStep(props: any) {
  const [sql, setSql] = React.useState('');

  const handleEditorValueChange = (value: string | undefined) => {
    // console.log(value);
  };

  return (
    <Box
      sx={{
        height: 500,
      }}
    >
      <Editor
        height="100%"
        theme="vs-dark"
        defaultLanguage="mysql"
        defaultValue={PLACEHOLDER}
        onChange={handleEditorValueChange}
      />
    </Box>
  );
}

export const BrowserOnlyReactJson = (props: ReactJsonViewProps) => {
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
