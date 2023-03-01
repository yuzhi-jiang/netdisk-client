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
  path: string;
  filters: string;
  sort: string;
} & Pagination;

export function getFileList(params?: Partial<FileParams>) {
  return axios.get<ListResult<NodeRecord[]>>('/api/filelist', {
    params,
  });
}
