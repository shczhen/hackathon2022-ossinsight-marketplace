import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { VariantType, useSnackbar } from 'notistack';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

import SQLTab, { PLACEHOLDER_SQL } from 'components/Tab/SQLTab';
import JSTab, { PLACEHOLDER_JS } from 'components/Tab/JSTab';
import ResultSQLTab from 'components/Tab/ResultSQLTab';
import ResultJSTab from 'components/Tab/ResultJSTab';
import ResultEchartsTab from 'components/Tab/ResultEchartsTab';
import SubmitPanelDialog from 'components/Dialog/SubmitPanelDialog';

import axios from 'lib/axios';
import { QueryResult } from 'packages/db/db';

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

  const [sqlValue, setSqlValue] = React.useState(PLACEHOLDER_SQL);
  const [sqlLoading, setSqlLoading] = React.useState(false);
  const [sqlResult, setSqlResult] = React.useState<QueryResult | null>(null);
  const [jsCodeValue, setJsCodeValue] = React.useState(PLACEHOLDER_JS);
  const [jsCodeResult, setJsCodeResult] = React.useState<any>(null);

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
      }
    };

  const handleSubmitSQL = async () => {
    setSqlLoading(true);
    try {
      const data = await axios
        .post('/api/sql/execute', {
          sql: sqlValue,
        })
        .then((res) => res.data);
      setSqlResult(data as QueryResult);
    } catch (error: any) {
      setSqlResult(null);
      enqueueSnackbar(`${error?.response?.data?.message || error.message}`, {
        variant: 'error',
      });
      console.error(error);
    } finally {
      setSqlLoading(false);
    }
  };

  const handleSubmitJSCode = async () => {
    try {
      const data = await axios
        .post('/api/vm/js', {
          scripts: jsCodeValue,
          data: sqlResult?.data,
        })
        .then((res) => res.data);
      setJsCodeResult(data.__result__);
    } catch (error: any) {
      setJsCodeResult(null);
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
          options: jsCodeResult,
          js: jsCodeValue,
          sql: sqlValue,
        })
        .then((res) => res.data);
    } catch (error: any) {
      enqueueSnackbar(`${error?.response?.data?.error || error.message}`, {
        variant: 'error',
      });
      console.error(error);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={2}>
        <Grid xs={6}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="SQL" {...a11yProps(0)} />
              <Tab label="JS Scritps" {...a11yProps(1)} />
            </Tabs>
            <Box
              sx={{
                marginLeft: 'auto',
              }}
            >
              <LoadingButton
                // variant="contained"
                disabled={sqlValue === ''}
                onClick={handleSubmitSQL}
                loading={sqlLoading}
                startIcon={<PlayCircleIcon fontSize="inherit" />}
                sx={{
                  display: value === 0 ? 'inline-flex' : 'none',
                }}
              >
                Run SQL
              </LoadingButton>
              <Button
                // variant="contained"
                disabled={jsCodeValue === ''}
                onClick={handleSubmitJSCode}
                startIcon={<PlayCircleIcon fontSize="inherit" />}
                sx={{
                  display: value === 1 ? 'inline-flex' : 'none',
                }}
              >
                Run Scripts
              </Button>
            </Box>
          </Box>
          <Box display={value === 0 ? 'block' : 'none'}>
            <SQLTab onChange={handleEditorInputChange('sql')} />
          </Box>
          <Box display={value === 1 ? 'block' : 'none'}>
            <JSTab onChange={handleEditorInputChange('js')} />
          </Box>
        </Grid>

        <Grid xs={6}>
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
              <ResultSQLTab data={sqlResult} />
            </Box>
            <Box display={resultTabValue === 1 ? 'block' : 'none'}>
              <ResultJSTab data={jsCodeResult} />
            </Box>
            <Box display={resultTabValue === 2 ? 'block' : 'none'}>
              <ResultEchartsTab data={jsCodeResult} />
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <SubmitPanelDialog
          sql={sqlValue}
          js={jsCodeValue}
          disabled={!(sqlValue && jsCodeValue && jsCodeResult)}
        />
      </Box>
    </Box>
  );
}
