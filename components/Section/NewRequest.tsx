import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { VariantType, useSnackbar } from 'notistack';

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
  const [echartValue, setEchartValue] = React.useState('');
  const [echartResult, setEchartResult] = React.useState<any>(null);

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleResultTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setResultTabValue(newValue);
  };

  const handleEditorInputChange =
    (type: 'sql' | 'js' | 'echart') => (code: string) => {
      if (type === 'sql') {
        setSqlValue(code);
      } else if (type === 'js') {
        setJsCodeValue(code);
      } else if (type === 'echart') {
        setEchartValue(code);
      }
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
    } catch (error: any) {
      enqueueSnackbar(`${error?.response?.data?.error || error.message}`, {
        variant: 'error',
      });
      console.error(error);
    }
  };

  const handleSubmitEchartCode = async () => {
    try {
      const data = await axios
        .post('/api/vm/echarts', {
          scripts: echartValue,
          data: jsCodeResult,
        })
        .then((res) => res.data);
      setEchartResult(data.result);
    } catch (error: any) {
      enqueueSnackbar(`${error?.response?.data?.error || error.message}`, {
        variant: 'error',
      });
      console.error(error);
    }
  };

  const handleSubmitReview = async () => {
    try {
      const data = await axios
        .post('/api/github/pr', {
          options: echartValue,
          js: jsCodeValue,
          sql: sqlValue,
        })
        .then((res) => res.data);
      setEchartResult(data.result);
    } catch (error: any) {
      enqueueSnackbar(`${error?.response?.data?.error || error.message}`, {
        variant: 'error',
      });
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
          <Tab label="JS Scritps" {...a11yProps(1)} />
          <Tab label="Options" {...a11yProps(2)} />
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
            disabled={echartValue === ''}
            onClick={handleSubmitEchartCode}
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
        <SQLTab onChange={handleEditorInputChange('sql')} />
      </Box>
      <Box display={value === 1 ? 'block' : 'none'}>
        <JSTab onChange={handleEditorInputChange('js')} />
      </Box>
      <Box display={value === 2 ? 'block' : 'none'}>
        <EChartsTab onChange={handleEditorInputChange('echart')} />
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={resultTabValue}
          onChange={handleResultTabChange}
          aria-label="result tabs"
        >
          <Tab label="query" {...a11yProps(0, 'result')} />
          <Tab label="results" {...a11yProps(1, 'result')} />
          <Tab label="echart" {...a11yProps(2, 'result')} />
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
          <ResultEchartsTab data={echartResult} />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          variant="contained"
          disabled={!(sqlValue && jsCodeValue && echartValue)}
          onClick={handleSubmitReview}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
}
