import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import SQLTab from 'components/Tab/SQLTab';
import JSTab from 'components/Tab/JSTab';
import ResultSQLTab from 'components/Tab/ResultSQLTab';
import ResultJSTab from 'components/Tab/ResultJSTab';
import ResultEchartsTab from 'components/Tab/ResultEchartsTab';

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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleResultTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setResultTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="SQL" {...a11yProps(0)} />
          <Tab label="Scritps" {...a11yProps(1)} />
        </Tabs>
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
        <JSTab />
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
          <ResultJSTab />
        </Box>
        <Box display={resultTabValue === 2 ? 'block' : 'none'}>
          <ResultEchartsTab />
        </Box>
      </Box>
    </Box>
  );
}
