import * as React from 'react';
import { useRouter, NextRouter } from 'next/router';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ReactEcharts from 'echarts-for-react';
import Alert from '@mui/material/Alert';

import axios from 'lib/axios';
import { QueryResult } from 'pages/api/sql/execute';

export type QueryParameterItemType = {
  name: string;
  placeholder: string;
  type: string;
  validate: {
    type: string;
    pattern: string;
  };
};

export interface RequestShareProps {
  parameters: QueryParameterItemType[];
  sql: string;
  js: string;
}

export default function RequestShare(props: RequestShareProps) {
  const { parameters, sql, js } = props;

  const [sqlCode, setSqlCode] = React.useState('');
  const [sqlResult, setSqlResult] = React.useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [option, setOption] = React.useState<any>(null);
  const [error, setError] = React.useState<any>(null);

  const router = useRouter();

  React.useEffect(() => {
    const newSql = replaceSql(sql, parameters, router.query);
    setSqlCode(newSql);
  }, [sql, parameters, router.query]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios
          .post('/api/sql/execute', {
            sql: sqlCode,
          })
          .then((res) => res.data);
        setSqlResult(data as QueryResult);
      } catch (error: any) {
        setSqlResult(null);
        console.error(error);
        setError(error);
        setIsLoading(false);
      }
    };
    if (sqlCode) {
      setError(null);
      setIsLoading(true);
      fetchData();
    }
  }, [sqlCode]);

  React.useEffect(() => {
    const fetchOption = async () => {
      try {
        const data = await axios
          .post('/api/vm/js', {
            scripts: js,
            data: sqlResult?.data,
          })
          .then((res) => res.data);
        setOption(data.__result__);
      } catch (error: any) {
        setOption(null);
        setError(error);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (sqlResult && js) {
      fetchOption();
    }
  }, [sqlResult, js]);

  return (
    <>
      {isLoading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {option && <ReactEcharts option={option} />}
      {error && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        </Backdrop>
      )}
    </>
  );
}

function replaceSql(
  sql: string,
  parameters: RequestShareProps['parameters'],
  data: NextRouter['query']
) {
  let newSql = sql;
  parameters.forEach((param) => {
    const targetValue = data[param.name];
    if (targetValue) {
      newSql = newSql.replace(param.placeholder, targetValue as string);
    }
  });
  return newSql;
}
