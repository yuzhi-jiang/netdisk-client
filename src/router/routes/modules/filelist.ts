import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const FileList: AppRouteRecordRaw = {
  name: 'filelist',
  path: '/filelist',
  component: DEFAULT_LAYOUT,
  redirect: '/filelist/all',
  meta: {
    locale: 'menu.filelist',
    requiresAuth: true,
    icon: 'icon-folder',
    order: 0,
  },
  children: [
    {
      name: 'file.all',
      path: 'all/:type?/:parentId?',
      component: () => import('@/views/filelist/all/index.vue'),
      meta: {
        locale: 'menu.filelist.all',
        requiresAuth: true,
        icon: 'icon-drive-file',
      },
    },
    {
      name: 'file.latest',
      path: 'latest',
      component: () => import('@/views/filelist/latest/index.vue'),
      meta: {
        locale: 'menu.filelist.latest',
        requiresAuth: true,
        icon: 'icon-clock-circle',
      },
    },
    {
      name: 'file.collection',
      path: 'collection',
      component: () => import('@/views/filelist/collection/index.vue'),
      meta: {
        locale: 'menu.filelist.collection',
        requiresAuth: true,
        icon: 'icon-star',
      },
    },
    {
      name: 'file.share',
      path: 'share',
      component: () => import('@/views/filelist/shares/index.vue'),
      meta: {
        locale: 'menu.filelist.share',
        requiresAuth: true,
        icon: 'icon-share-alt',
      },
    },
    {
      name: 'file.recycle',
      path: 'recycle',
      component: () => import('@/views/filelist/recycle/index.vue'),
      meta: {
        locale: 'menu.filelist.recycle',
        requiresAuth: true,
        icon: 'icon-relation',
      },
    },
  ],
};

export default FileList;
