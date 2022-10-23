import React, { useEffect } from 'react';
import hljs from 'highlight.js'; // import hljs library
import 'highlight.js/styles/github.css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import sql from 'highlight.js/lib/languages/sql';
import Box from '@mui/material/Box';
import copy from 'copy-to-clipboard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CheckIcon from '@mui/icons-material/Check';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('sql', sql);

export default function Highlighter(props: {
  content: string;
  language?: string[];
}): JSX.Element {
  const { content = '', language } = props;
  const [highlightedCode, setHighlightedCode] = React.useState('');
  const [isCopied, setIscopied] = React.useState(false);

  useEffect(() => {
    if (content) {
      const data = hljs.highlightAuto(content, language).value;

      setHighlightedCode(data);
    }
  }, [content, language]);

  const handleButtonsContent = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isCopied) {
      return false;
    }
    setIscopied(true);
    setTimeout(() => {
      setIscopied(false);
    }, 2000);
    return true;
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const shouldCopy = handleButtonsContent(event);
    shouldCopy && copy(props.content);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        '& pre': {
          backgroundColor: '#f6f8fa',
          borderRadius: '6px',
          // fontSize: '85%',
          lineHeight: '1.45',
          overflow: 'auto',
          padding: '1rem 3rem 1rem 1rem',

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
      <Tooltip title={isCopied ? 'Copied!' : 'Copy'}>
        <IconButton
          size="small"
          aria-label="copy"
          onClick={handleClick}
          sx={{
            position: 'absolute',
            top: '1.5rem',
            right: '1rem',
          }}
        >
          {isCopied ? (
            <CheckIcon fontSize="inherit" />
          ) : (
            <ContentCopyIcon fontSize="inherit" />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
