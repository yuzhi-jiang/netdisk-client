import type { NodeRecord, ReqParams } from '@/api/filelist';
import { IShareRouteReqParams } from '@/api/shares';

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
    reqParams: IShareRouteReqParams;
  }
) => {
  const { pageSize, page } = tableParams;
  const {
    reqParams: { shareId, parentFileId },
  } = routeParams;
  // console.log('tableParams ', parentFileId);
  // adapter
  const pageNum = page;

  const params = {
    shareId,
    parentFileId: parentFileId || 'root',
    pageNum,
    pageSize,
  };

  return params;
};

export default {
  formatList,
  paramsAdapter,
};
