import Axios from 'axios';

const axios = Axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3+json',
  },
  timeout: 10000,
});

export function getUserDetails(accessToken: string) {
  return axios
    .get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data);
}

export function createPr(
  accessToken: string,
  owner: string,
  repo: string,
  title: string,
  body: string,
  head: string,
  base: string
) {
  return axios
    .post(
      `https://api.github.com/repos/${owner}/${repo}/pulls`,
      {
        title,
        body,
        head,
        base,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .then((res) => res.data);
}
