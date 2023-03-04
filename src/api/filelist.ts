import axios, { AxiosResponse } from 'axios';
import type { Pagination, ListResult } from '@/types/global';

export interface FolderRecord {
  id: string;
  parent_id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  type: 'file' | 'folder'; // convenience
  tags?: string[];
}

export type FileRecord = {
  file_extension: string;
  category: string;
  mime_type: string;
  url: string;
  thumbnail: string;
  size: number;
  meta: Record<string, any>;
} & FolderRecord;

export type NodeRecord = Partial<FileRecord>;

export type FileParams = {
  page: string;
  search: string;
  type: 'folder' | 'file';
  order: string;
  fileId: string;
  parentId: string;
} & Pagination;

export type ReqQueries = {
  search: string;
};
export type ReqParams = Partial<FileParams>;

/**
 * 获取文件列表
 * @param {ReqParams} params
 * @returns {AxiosResponse<ListResult<NodeRecord>>}
 */
export function getFileList(params?: ReqParams) {
  return axios.get<ListResult<NodeRecord>>('/api/filelist', {
    params,
  });
}

/**
 * 创建文件/文件夹
 * @returns {AxiosResponse}
 */
export function postNode() {
  return axios.post('/api/filelist', {});
}

/**
 * 修改文件/文件夹名称
 * @returns {AxiosResponse}
 */
export function putNode() {
  return axios.put('/api/filelist', {});
}

/**
 * 删除文件/文件夹
 * @param {String} id
 * @returns {AxiosResponse}
 */
export function deleteNode(id: string) {
  return axios.delete('/api/filelist', { data: { id } });
}

/**
 * 批量删除文件/文件夹
 * @param {String[]} ids
 * @returns {AxiosResponse}
 */
export function deleteNodes(ids: string[] = []) {
  return axios.delete('/api/filelist', { data: { ids } });
}
