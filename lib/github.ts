import Axios from 'axios';

const axios = Axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3+json',
  },
  timeout: 10000,
});

export function getUserDetails(accessToken: string) {
  return axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  });
}
