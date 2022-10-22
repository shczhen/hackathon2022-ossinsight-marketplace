import * as React from 'react';
import { useRouter } from 'next/router';

export interface RequestShareProps {
  params: {
    name: string;
    replaces: string | number;
    type: string;
    validate: {
      type: string;
      pattern: string;
    };
  }[];
  sql: string;
  js: string;
}

export default function RequestShare(props: RequestShareProps) {
  const { params, sql, js } = props;

  const router = useRouter();

  const { type } = router.query;

  return <></>;
}

function replaceSql(sql: string, params: RequestShareProps['params']) {
  let newSql = sql;
  params.forEach((param) => {
    newSql = newSql.replace(param.replaces, param.name);
  });
  return newSql;
}
