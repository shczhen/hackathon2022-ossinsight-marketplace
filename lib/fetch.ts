import axios from 'axios';
import useSWR from 'swr';

const instance = axios.create({
  // baseURL: '/api/',
  timeout: 10000,
});

export default instance;

// const fetcherGet = (url: string) => instance.get(url).then((res) => res.data);

// export function useGet(url: string) {
//   return useSWR(url, fetcherGet);
// }
