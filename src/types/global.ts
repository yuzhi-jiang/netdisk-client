import type { ValidatedError } from '@arco-design/web-vue/es/form';

export interface AnyObject {
  [key: string]: unknown;
}

export interface Options {
  value: unknown;
  label: string;
}

export interface NodeOptions extends Options {
  children?: NodeOptions[];
}

export interface GetParams {
  body: null;
  type: string;
  url: string;
}

export interface PostData {
  body: string;
  type: string;
  url: string;
}

export interface Pagination {
  current: number;
  pageSize: number;
  total?: number;
  showTotal?: boolean;
  showPageSize?: boolean;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
}

export interface FormSubmit {
  values: Record<string, any>;
  errors: Record<string, ValidatedError> | undefined;
}

export interface ListResult<T = unknown> {
  list: T[];
  total: number;
}

export type TimeRanger = [string, string];

export interface GeneralChart {
  xAxis: string[];
  data: Array<{ name: string; value: number[] }>;
}

export type Callback = (error?: string) => void;
