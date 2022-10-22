import { throttling } from '@octokit/plugin-throttling';
import { Octokit } from 'octokit';

export const CustomOctokit = Octokit.plugin(throttling);

export function getOctokit(token: string) {
  return new CustomOctokit({
    auth: token,
    throttle: {
      onRateLimit: (retryAfter: number, options: any, octokit: Octokit) => {
        octokit.log.warn(
          `Request quota exhausted for request ${options.method} ${options.url}`
        );
  
        if (options.request.retryCount <= 1) {
          // only retries once
          octokit.log.info(`Retrying after ${retryAfter} seconds!`);
          return true;
        }
      },
      onSecondaryRateLimit: (retryAfter: number, options: any, octokit: Octokit) => {
        octokit.log.warn(
          `SecondaryRateLimit detected for request ${options.method} ${options.url}`
        );

        if (options.request.retryCount <= 1) {
          // only retries once
          octokit.log.info(`Retrying after ${retryAfter} seconds!`);
          return true;
        }
      },
    },
  });
}