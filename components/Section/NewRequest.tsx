import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import SQLTab from 'components/Tab/SQLTab';
import JSTab from 'components/Tab/JSTab';
import EChartsTab from 'components/Tab/EChartsTab';
import ResultSQLTab from 'components/Tab/ResultSQLTab';
import ResultJSTab from 'components/Tab/ResultJSTab';
import ResultEchartsTab from 'components/Tab/ResultEchartsTab';

import axios from 'lib/axios';

// ! TOREMOVE
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
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number, type = 'simple-tab') {
  return {
    id: `${type}-${index}`,
    'aria-controls': `${type}-${index}`,
  };
}

export default function NewRequestSection() {
  const [value, setValue] = React.useState(0);
  const [resultTabValue, setResultTabValue] = React.useState(0);

  const [sqlValue, setSqlValue] = React.useState('');
  // const [sqlResult, setSqlResult] = React.useState<any>(null);
  const [sqlResult, setSqlResult] = React.useState<any>(MOCK_SQL_RESULT_JSON);
  const [jsCodeValue, setJsCodeValue] = React.useState('');
  const [jsCodeResult, setJsCodeResult] = React.useState<any>(null);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleResultTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setResultTabValue(newValue);
  };

  const handleJSCodeChange = (code: string) => {
    setJsCodeValue(code);
  };

  const handleSubmitJSCode = async () => {
    try {
      const data = await axios
        .post('/api/vm/js', {
          scripts: jsCodeValue,
          data: sqlResult,
        })
        .then((res) => res.data);
      setJsCodeResult(data.result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="SQL" {...a11yProps(0)} />
          <Tab label="Scritps" {...a11yProps(1)} />
          <Tab label="ECharts" {...a11yProps(2)} />
        </Tabs>
        <Box
          sx={{
            marginLeft: 'auto',
          }}
        >
          <Button
            variant="contained"
            sx={{
              display: value === 0 ? 'inline-flex' : 'none',
            }}
          >
            Run SQL
          </Button>
          <Button
            variant="contained"
            disabled={jsCodeValue === ''}
            onClick={handleSubmitJSCode}
            sx={{
              display: value === 1 ? 'inline-flex' : 'none',
            }}
          >
            Run Scripts
          </Button>
          <Button
            variant="contained"
            sx={{
              display: value === 2 ? 'inline-flex' : 'none',
            }}
          >
            Run Option
          </Button>
        </Box>
      </Box>
      {/* <TabPanel value={value} index={0}>
        <SQLTab />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <JSTab />
      </TabPanel> */}
      <Box display={value === 0 ? 'block' : 'none'}>
        <SQLTab />
      </Box>
      <Box display={value === 1 ? 'block' : 'none'}>
        <JSTab onChange={handleJSCodeChange} />
      </Box>
      <Box display={value === 2 ? 'block' : 'none'}>
        <EChartsTab />
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={resultTabValue}
          onChange={handleResultTabChange}
          aria-label="result tabs"
        >
          <Tab label="query" {...a11yProps(0, 'result')} />
          <Tab label="results" {...a11yProps(1, 'result')} />
          <Tab label="chart" {...a11yProps(2, 'result')} />
        </Tabs>
      </Box>
      <Box
        sx={{
          height: 500,
          overflow: 'auto',
        }}
      >
        <Box display={resultTabValue === 0 ? 'block' : 'none'}>
          <ResultSQLTab />
        </Box>
        <Box display={resultTabValue === 1 ? 'block' : 'none'}>
          <ResultJSTab data={jsCodeResult} />
        </Box>
        <Box display={resultTabValue === 2 ? 'block' : 'none'}>
          <ResultEchartsTab />
        </Box>
      </Box>
    </Box>
  );
}
