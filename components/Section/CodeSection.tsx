import React, { useEffect } from 'react';
import hljs from 'highlight.js'; // import hljs library
import 'highlight.js/styles/github.css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import sql from 'highlight.js/lib/languages/sql';

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
    <pre className="hljs">
      {highlightedCode && (
        <code
          className="hljs"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      )}
    </pre>
  );
}
