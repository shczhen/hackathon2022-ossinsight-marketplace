import * as React from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Editor from '@monaco-editor/react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReactJson, { ReactJsonViewProps } from 'react-json-view';

const PLACEHOLDER = `/**
* Implement a function here.
* We will pass the result of your SQL query to the this function.
* @param data Result of your SQL query.
* @param result Default {}. You can set this value to pass to the next step.
*/
function main(data) {
 // Example:
 const result = data;
 return result;
};`;

export interface JSTabProps {
  onChange?: (code: string) => void;
}

export default function JSTab(props: JSTabProps) {
  const [editorValue, setEditorValue] = React.useState('');

  const handleEditorValueChange = (value: string | undefined) => {
    // console.log(value);
    // setEditorValue(value || '');
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
