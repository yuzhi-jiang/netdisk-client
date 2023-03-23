import { useI18n } from 'vue-i18n';
import {
  IconPlus,
  IconDelete,
  IconShareAlt,
} from '@arco-design/web-vue/es/icon';
import type { IColumn } from '@/components/list/types';
import type { NodeRecord } from '@/api/filelist';

export default function useList() {
  const { t, d } = useI18n();

  const columns: IColumn[] = [
    {
      title: 'filelist.name', // file.name
      prop: 'fileName',
      sortable: true,
      // defaultSortOrder: 'descend' as const,
      width: 200,
    },
    {
      title: 'filelist.updated_at', // file.updated_at
      prop: 'modifyTime',
      sortable: true,
      // defaultSortOrder: 'descend' as const,
      formatter: (date: string) => {
        if (date) {
          return d(date, 'long');
        }
        return '-';
      },
      width: 200,
    },
    {
      title: 'filelist.type', // file.type
      prop: 'type',
      formatter: (row, idx, record: NodeRecord) => {
        return row === 'folder' ? '文件夹' : '文件';
      },
      width: 100,
    },
    {
      title: 'filelist.size', // file.size
      prop: 'length',
      sortable: true,
      formatter: (row, rowIndex, record: NodeRecord) => {
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
      trigger: true,
    },
    {
      key: 'batch-delete',
      icon: IconDelete,
      type: 'text' as const,
      bulk: true,
      // confirm: true,
      // confirmText: 'list.actions.confirm.bulk-delete',
    },
    {
      key: 'create-share',
      icon: IconShareAlt,
      type: 'text' as const,
      bulk: true,
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
