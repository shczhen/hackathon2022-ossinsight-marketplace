import * as React from 'react';
import Box from '@mui/material/Box';
import ReactEcharts from 'echarts-for-react';
import Typography from '@mui/material/Typography';

export default function ResultEchartsTab(props: { data?: any }) {
  return (
    <Box
      sx={{
        padding: '2rem 0',
      }}
    >
      {props?.data ? (
        <ReactEcharts option={props?.data} />
      ) : (
        <Typography>Empty</Typography>
      )}
    </Box>
  );
}
