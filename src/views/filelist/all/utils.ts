import type { NodeRecord } from '@/api/filelist';

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

export default {
  formatList,
};
