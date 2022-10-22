/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface Panel {
  title: string;
  name: string;
  topic?: unknown[];
  description?: string;
  query?: {
    definition: string;
    template: string;
    ignoreCache?: boolean;
  };
  render?: {
    cache?: {
      ttl: number;
    };
    src: string;
  };
  author?: string[];
  shared?: boolean;
}
