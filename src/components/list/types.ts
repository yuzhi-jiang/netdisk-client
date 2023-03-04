import type { Component } from 'vue';
import type { ButtonProps } from '@arco-design/web-vue/es/button';
import type { TableFilterData } from '@arco-design/web-vue/es/table';

export interface IColumn {
  title: string;
  prop: string;
  width?: number;
  menus?: IColumn[];
  formatter?: (row: any, rowIndex: number, record: any) => unknown;
  sortable?: boolean;
  defaultSortOrder?: 'descend' | 'ascend' | '';
  filterable?: boolean;
  filters?: { text: string; value: number | string }[];
  filterEmpty?: { text: string; value: number | string };
  filterRequest?: (values: (string | number)[]) => IColumn['filters'];
  filterLimitSize?: number;
}

export interface IOption {
  label: string;
  value: number | string;
}
export interface ActionButton {
  key: string;
  type?: ButtonProps['type'];
  status?: ButtonProps['status'];
  text?: string;
  icon?: Component;
  comp?: 'button' | string;
  menus?: ActionButton[];
  confirm?: boolean;
  confirmText?: string;
  trigger?: boolean;
  triggerContent?: Component;
  bulk?: boolean;
  hidden?: boolean | ((record: any) => boolean);
}

export interface ActionInput {
  key: string;
  comp: 'input' | string;
  options?: IOption[];
  defaultValue?: string;
  placeholder?: string;
}

export type IAction = ActionButton | ActionInput;

export const isInputAction = (action: IAction): action is ActionInput =>
  action?.comp === 'input';

export const isButtonAction = (action: IAction): action is ActionButton =>
  action?.comp === undefined || action?.comp === 'button';

export type ActionInputRecord = {
  search: string;
  type: 'enter' | 'search' | 'clear';
  [p: string]: unknown;
};
