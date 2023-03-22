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
export const formatSize = (size: number, accuracy = 0) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let idx = 0;
  while (idx < units.length - 1 && size > 1024) {
    size /= 1024;
    idx += 1;
  }
  return `${size.toFixed(accuracy)} ${units[idx]}`;
};

export const paramsAdapter = (
  tableParams: ReqParams & { page: number },
  routeParams: {
    reqParams: ReqParams;
    reqQueries: ReqQueries;
  }
) => {
  const userStore = useUserStore();
  const { pageSize, page } = tableParams;
  // adapter
  const { reqParams, reqQueries } = routeParams;
  const diskId = userStore.$state.diskVo?.diskId;

  const params = {
    diskId,
    pageNum: page,
    pageSize,
  };

  return params;
};

export default {
  formatList,
  paramsAdapter,
};
