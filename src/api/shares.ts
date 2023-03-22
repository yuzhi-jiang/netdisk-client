import { ListResult } from '@/types/global';
import axios from 'axios';

export interface ShareNodeRecord {
  diskId: string;
  expiredTime: string;
  fileIdList: string[];
  fullShareMsg: string;
  isValid: number;
  shareId: string;
  sharePwd: string;
  shareTitle: string;
  type: 'folder' | 'file';
}

/**
 * 获取分享文件列表
 * @param params
 * @returns
 */
export function getShareList(params = {}) {
  return axios.get<ListResult<ShareNodeRecord>>('/front/share/list', {
    params,
  });
}

export interface PostShareNode {
  diskId: string;
  expiration: string;
  fileIdList: string[];
  sharePwd: string;
  type: 0 | 1 | 2 | 3; // 分享文件的类型 1，文件，2，文件夹，3.txt,4.doc,5.other
}

export function postShareNode(params: PostShareNode) {
  return axios.post('/front/share/create', params);
}

export interface DeleteNodeRecord {
  diskId: string;
  shareIds: string[];
}

/**
 * 删除文件分享
 * @param params
 * @returns
 */
export function deleteShareNodes(params: DeleteNodeRecord) {
  return axios.delete('/front/share/cancel', {
    params: {
      diskId: params.diskId,
    },
    data: params.shareIds,
  });
}

/**
 * 清空分享
 * @param diskId
 * @returns
 */
export function clearShareBox(diskId: string) {
  return axios.post(`/front/share/clear/${diskId}`);
}
