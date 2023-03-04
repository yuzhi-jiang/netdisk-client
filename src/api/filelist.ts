import axios from 'axios';
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

export function getFileList(params?: ReqParams) {
  return axios.get<ListResult<NodeRecord>>('/api/filelist', {
    params,
  });
}
