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

interface RequestBody {
  body: {
    diskId: string;
    fileId: string;
  };
}

interface RequestParams {
  requests: Request[];
}

/**
 * 删除节点
 * @param params
 * @returns
 */
export function deleteNodes(params: RequestBody[]) {
  return axios.post('/front/file/recycle/delete', {
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
