import type { NodeRecord, ReqParams, ReqQueries } from '@/api/filelist';
import { useUserStore } from '@/store';

export const formatList = (list: NodeRecord[]) => {
  // you can use algorithm to swap folder and file
  const folders: NodeRecord[] = [];
  const files: NodeRecord[] = [];
  list.forEach((item) => {
    if (item.type === 'folder') {
      folders.push(item);
    } else {
      files.push(item);
    }
  });
  return [...folders, ...files];
};

/**
 * 格式化文件大小
 * @param {Number} size 文件大小
 * @param {Number} [accuracy=0] 精确到的小数点数
 * @return {String} 1TB
 */
export const formatSize = (_size: string, accuracy = 0) => {
  let size = Number(_size);
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let idx = 0;
  while (idx < units.length - 1 && size > 1024) {
    size /= 1024;
    idx += 1;
  }
  const res = size ? `${size?.toFixed(accuracy)} ${units[idx]}` : '-';
  return res;
};

export const paramsAdapter = (
  /**
   * 表格参数
   */
  tableParams: ReqParams & { page: number },
  /**
   * 路由参数
   */
  routeParams: {
    reqParams: ReqParams;
    reqQueries: ReqQueries;
  }
) => {
  const userStore = useUserStore();
  const { pageSize, page } = tableParams;
  console.log('tableParams ', tableParams);
  // adapter
  const { reqParams, reqQueries } = routeParams;
  const search = tableParams.search || reqQueries.search;
  const parentFileId = reqParams.parentFileId || 'root';
  const fileId = reqParams.parentFileId || 'root';
  const diskId = userStore.$state.diskVo?.diskId;
  const pageNum = page;

  const params = {
    ...reqQueries,
    ...reqParams,
    ...tableParams,
    search: search ? `name = ${search}` : search,
    parentFileId,
    fileId,
    diskId,
    pageNum,
  };

  return params;
};

export default {
  formatList,
  paramsAdapter,
};
