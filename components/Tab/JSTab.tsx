import * as React from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Editor from '@monaco-editor/react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReactJson, { ReactJsonViewProps } from 'react-json-view';

const PLACEHOLDER = `/**
* Implement the main function here.
* We will pass the result of your SQL query to the this function.
* You should not use any variables starting with '__' in this function. (such as '__result__')
* @param data Result of your SQL query.
* @param option ECharts option.
*/
function main(data) { 
 // Do remember to return the echart option here.
 const myOption = {
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
 };
 return myOption;
}`;

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

// /**
//  * Implement the main function here.
//  * You should not use any variables starting with '_' in this function.
//  * We will pass the result of your SQL query to the this function.
//  * @param data Result of your SQL query.
//  */
// function main(data) {
//   // Do remember to return the echart option here.
//   return {
//     xAxis: {
//       type: 'category',
//       data: data.map(i => i.actor_login)
//     },
//     yAxis: {
//       type: 'value'
//     },
//     series: [
//       {
//         data: data.map(i => i.comments),
//         type: 'bar'
//       }
//     ]
//   };
// }
