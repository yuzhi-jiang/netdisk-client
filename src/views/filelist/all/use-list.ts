import { useI18n } from 'vue-i18n';
import { IconPlus, IconDelete } from '@arco-design/web-vue/es/icon';
import type { IColumn } from '@/components/list/types';
import type { NodeRecord } from '@/api/filelist';

export default function useList() {
  const { t, d } = useI18n();

  const columns: IColumn[] = [
    {
      title: 'filelist.name', // file.name
      prop: 'name',
      sortable: true,
      // defaultSortOrder: 'descend' as const,
      width: 200,
    },
    {
      title: 'filelist.tags', // file.tag
      prop: 'tags',
      // sortable: true,
      // defaultSortOrder: 'descend' as const,
      // formatter: (date: string) => d(date, 'long'),
      width: 100,
    },
    {
      title: 'filelist.updated_at', // file.updated_at
      prop: 'updated_at',
      sortable: true,
      // defaultSortOrder: 'descend' as const,
      formatter: (date: string) => d(date, 'long'),
      width: 200,
    },
    {
      title: 'filelist.type', // file.type
      prop: 'type',
      formatter: (row, idx, record: NodeRecord) => {
        // eslint error: camecase
        const { file_extension: ext, type } = record;
        if (ext) {
          return `${ext} ${t('file')}`;
        }
        return type === 'folder' ? t('folder') : t('file');
      },
      width: 100,
    },
    {
      title: 'filelist.size', // file.size
      prop: 'size',
      sortable: true,
      formatter: (row, rowIndex, record: NodeRecord) => {
        console.log('record', 'record');
        if (record.type === 'folder') {
          return '';
        }
        return row;
      },
      width: 70,
    },
  ];

  const toolbar = [
    {
      key: 'search',
      comp: 'input',
      placeholder: 'filelist.toolbar.input.placeholder',
    },
    {
      key: 'create',
      icon: IconPlus,
    },
    {
      key: 'bulk-delete',
      icon: IconDelete,
      type: 'text' as const,
      bulk: true,
      confirm: true,
      confirmText: 'list.actions.confirm.bulk-delete',
    },
  ];

  const actions = [
    {
      key: 'update',
    },
    {
      key: 'delete',
      status: 'danger' as const,
      confirm: true,
      confirmText: 'list.actions.confirm.delete',
    },
  ];

  return { columns, toolbar, actions };
}
