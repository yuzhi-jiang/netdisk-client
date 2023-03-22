import axios from 'axios';

export interface FileListParams {
  diskId: string;
  page: number;
  pageSize: number;
  order: string;
}

export function getFileList(params: FileListParams) {
  return axios.get('/front/file/recycle/list', {
    params,
  });
}

export interface RequestBody {
  body: {
    diskId: string;
    fileId: string;
  };
}

export interface RequestParams {
  requests: Request[];
}

/**
 * 往回收站添加文件，即主页面删除文件
 * @param params
 * @returns
 */
export function addNodes(params?: RequestBody[]) {
  return axios.post('/front/file/recycle/add', {
    diskId: params?.[0].body.diskId,
    requests: params,
  });
}

/**
 * 删除节点
 * @param params
 * @returns
 */
export function deleteNodes(params: RequestBody[]) {
  return axios.post('/front/file/recycle/delete', {
    diskId: params?.[0].body.diskId,
    requests: params,
  });
}

/**
 * 回复节点
 * @param params
 * @returns
 */
export function recoverNodes(params: RequestBody[]) {
  return axios.post('/front/file/recycle/restore', {
    diskId: params?.[0].body.diskId,
    requests: params,
  });
}

/**
 * 清空回收站
 * @param diskId
 * @returns
 */
export function clearRecycleBox(diskId: string) {
  return axios.post(
    '/front/file/recycle/clear',
    {},
    {
      params: {
        diskId,
      },
    }
  );
}
