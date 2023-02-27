import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const FileList: AppRouteRecordRaw = {
  name: 'filelist',
  path: '/filelist',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.filelist',
    requiresAuth: true,
    icon: 'icon-folder',
    order: 0,
  },
  children: [
    {
      name: 'file.all',
      path: 'all',
      component: null,
      meta: {
        locale: 'menu.filelist.all',
        requiresAuth: true,
        icon: 'icon-drive-file',
      },
    },
    {
      name: 'file.collection',
      path: 'collection',
      component: null,
      meta: {
        locale: 'menu.filelist.collection',
        requiresAuth: true,
        icon: 'icon-star',
      },
    },
    {
      name: 'file.latest',
      path: 'latest',
      component: null,
      meta: {
        locale: 'menu.filelist.latest',
        requiresAuth: true,
        icon: 'icon-clock-circle',
      },
    },
  ],
};

export default FileList;
