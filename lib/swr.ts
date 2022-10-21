import * as React from 'react';
import useSWR, { Middleware, SWRHook } from 'swr';

export const logger: Middleware = (useSWRNext: SWRHook) => {
  return (key: any, fetcher: any, config: any) => {
    // Add logger to the original fetcher.
    const extendedFetcher = (...args: any[]) => {
      console.log('SWR Request:', key);
      return fetcher(...args);
    };

    // Execute the hook with the new fetcher.
    return useSWRNext(key, extendedFetcher, config);
  };
};

// This is a SWR middleware for keeping the data even if key changes.
export const laggy: Middleware = (useSWRNext: SWRHook) => {
  return (key: any, fetcher: any, config: any) => {
    // Use a ref to store previous returned data.
    const laggyDataRef = React.useRef();

    // Actual SWR hook.
    const swr = useSWRNext(key, fetcher, config);

    React.useEffect(() => {
      // Update ref if data is not undefined.
      if (swr.data !== undefined) {
        laggyDataRef.current = swr.data;
      }
    }, [swr.data]);

    // Expose a method to clear the laggy data, if any.
    const resetLaggy = React.useCallback(() => {
      laggyDataRef.current = undefined;
    }, []);

    // Fallback to previous data if the current data is undefined.
    const dataOrLaggyData =
      swr.data === undefined ? laggyDataRef.current : swr.data;

    // Is it showing previous data?
    const isLagging =
      swr.data === undefined && laggyDataRef.current !== undefined;

    // Also add a `isLagging` field to SWR.
    return Object.assign({}, swr, {
      data: dataOrLaggyData,
      isLagging,
      resetLaggy,
    });
  };
};

export const serialize: Middleware = (useSWRNext: SWRHook) => {
  return (key: any, fetcher: any, config: any) => {
    // Serialize the key.
    const serializedKey = Array.isArray(key) ? JSON.stringify(key) : key;

    // Pass the serialized key, and unserialize it in fetcher.
    return useSWRNext(
      serializedKey,
      (k: any) => fetcher(...JSON.parse(k)),
      config
    );
  };
};
