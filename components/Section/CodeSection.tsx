import React, { useEffect } from 'react';
import hljs from 'highlight.js'; // import hljs library
import 'highlight.js/styles/github.css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import sql from 'highlight.js/lib/languages/sql';
import Box from '@mui/material/Box';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('sql', sql);

export default function Highlighter(props: {
  content: string;
  language?: string[];
}): JSX.Element {
  const { content = '', language } = props;
  const [highlightedCode, setHighlightedCode] = React.useState('');

  useEffect(() => {
    if (content) {
      const data = hljs.highlightAuto(content, language).value;

      setHighlightedCode(data);
    }
  }, [content, language]);

  return (
    <Box
      sx={{
        '& pre': {
          backgroundColor: '#f6f8fa',
          borderRadius: '6px',
          // fontSize: '85%',
          lineHeight: '1.45',
          overflow: 'auto',
          padding: '16px',

          '& code': {
            backgroundColor: 'transparent',
          },
        },
      }}
    >
      <pre className="hljs">
        {highlightedCode && (
          <code
            className="hljs"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        )}
      </pre>
    </Box>
  );
}
