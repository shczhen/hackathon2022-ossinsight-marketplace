import * as React from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Editor from '@monaco-editor/react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReactJson, { ReactJsonViewProps } from 'react-json-view';

const PLACEHOLDER = `const option = {
  xAxis: {
    type: 'category',
    data: data.map(i => i.actor_login)
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: data.map(i => i.comments),
      type: 'bar'
    }
  ]
};`;

export interface EChartsTabProps {
  onChange?: (code: string) => void;
}

export default function EChartsTab(props: EChartsTabProps) {
  const [value, setValue] = React.useState('');

  const handleEditorValueChange = (value: string | undefined) => {
    // console.log(value);
    props?.onChange && props.onChange(value || '');
  };

  return (
    <Box
      sx={{
        height: 200,
      }}
    >
      <Editor
        height="100%"
        theme="vs-dark"
        defaultLanguage="javascript"
        defaultValue={PLACEHOLDER}
        onChange={handleEditorValueChange}
      />
    </Box>
  );
}
