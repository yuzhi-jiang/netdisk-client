import axios, { AxiosResponse } from 'axios';
import type { Pagination, ListResult } from '@/types/global';

export interface FolderRecord {
  diskId: string;
  fileId: string;
  parentFileId: string;
  fileName: string;
  length: string;
  hash: string;
  status: string;
  createTime: string;
  modifyTime: string;
  type: 'file' | 'folder'; // convenience
  modifyUser?: string;
}

export type FileRecord = {
  // file_extension: string;
  // category: string;
  // mime_type: string;
  // url: string;
  // thumbnail: string;
  // size: number;
  meta: Record<string, any>;
} & FolderRecord;

export type NodeRecord = Partial<FileRecord>;

export type FileParams = {
  fileId: string;
  parentFileId: string;
  diskId: string;
  search: string;
  type: 'folder' | 'file';
  pageNum: number;
  pageSize: number;
  order: string;
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
  return axios.get<ListResult<NodeRecord>>('/front/file/list', { params });
}

/**
 * 创建文件/文件夹
 * @returns {AxiosResponse}
 */
export function postFolder(params: ReqParams) {
  return axios.post('/front/file/createWithFolders', params);
}

export function postFile() {}

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

export interface IForm {
  diskId: string;
  requests: Array<{
    body: {
      diskId: string;
      fileId: string;
      toDiskId: string;
      toParentFileId: string;
    };
    fileId: string;
  }>;
}

/**
 * 移动内容
 * @param form
 */
export function moveNodes(form: IForm) {
  return axios.put('/front/file/move', form);
}

export interface IDownFileRecord {
  diskId: string;
  fileId: string;
}

/**
 * 获取文件下载链接，并可以预览
 * @param params
 * @returns
 */
export function getFileDownloadLink(params: IDownFileRecord) {
  return axios.get('/front/file/getDownloadUrl', {
    params,
  });
}
