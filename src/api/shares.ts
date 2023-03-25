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
  shareUrl: string;
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

export interface IPostShareNode {
  diskId: string;
  expiredTime: string;
  fileIdList: string[];
  sharePwd: string;
  type: 0 | 1 | 2 | 3; // 分享文件的类型 1，文件，2，文件夹，3.txt,4.doc,5.other
}

export function postShareNode(params: IPostShareNode) {
  return axios.post<ShareNodeRecord>('/front/share/create', params);
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
  return axios.delete(`/front/share/clear`, {
    params: {
      diskId,
    },
  });
}

/**
 * 获取他人分享的文件信息，如是否需要密码
 * @param shareId
 * @returns
 */
export function getShareInfo(shareId: string) {
  return axios.get('/front/share/info', {
    params: {
      shareId,
    },
  });
}

export interface IShareTokenParams {
  shareId: string;
  sharePwd: string;
}

/**
 * 获取token访问全西安
 * @param params
 * @returns
 */
export function getShareToken(params: IShareTokenParams) {
  return axios.get('/front/share/getShareToken', {
    params,
  });
}

export interface IShareRouteReqParams {
  shareId: string;
  parentFileId: string;
}

export interface OtherShareParams {
  shareId: string;
  pageNum: number;
  pageSize: number;
  parentFileId: string;
}

/**
 * 获取他人分享
 * @param params
 * @returns
 */
export function getOtherShares(params: OtherShareParams, shareToken: string) {
  return axios.get('/front/file/listByShare', {
    params,
    headers: {
      shareToken,
    },
  });
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
 * 转存他人分享
 * @param params
 * @returns
 */
export function putOtherShares(params: IForm) {
  return axios.put('/front/share/save', params);
}
