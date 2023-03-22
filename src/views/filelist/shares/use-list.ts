import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { IconPlus, IconDelete } from '@arco-design/web-vue/es/icon';
import type { IColumn } from '@/components/list/types';
import type { ShareNodeRecord } from '@/api/shares';
import { getDiffTime } from '@/utils/time';

export default function useList() {
  const { t, d } = useI18n();

  const columns: IColumn[] = [
    {
      title: 'filelist.name', // file.name
      prop: 'shareTitle',
      sortable: true,
      // defaultSortOrder: 'descend' as const,
      width: 200,
    },
    {
      title: 'sharelist.expiredTime', // file.updated_at
      prop: 'expiredTime',
      sortable: true,
      formatter: (date: string) => {
        if (date) {
          return d(date, 'long');
        }
        return '-';
      },
      width: 200,
    },
    {
      title: 'sharelist.sharePwd',
      prop: 'sharePwd',
      formatter: (row, idx, record: ShareNodeRecord) => {
        return row;
      },
      width: 100,
    },
    {
      title: 'sharelist.isValid',
      prop: 'isValid',
      sortable: true,
      formatter: (row, rowIndex, record: ShareNodeRecord) => {
        const { expiredTime: expired } = record;
        // 如果为空则为永久有效
        if (!expired) return '永久有效';

        // yyyy-MM-dd HH:mm:ss
        const currTime = new Date().getTime();
        const expiredTime = new Date(expired).getTime();
        if (currTime - expiredTime <= 0) return '已过期';

        // 天 时 分
        return getDiffTime(new Date(currTime), new Date(expiredTime));
      },
      width: 100,
    },
  ];

  const toolbar = [
    {
      key: 'batch-delete',
      icon: IconDelete,
      type: 'text' as const,
      bulk: true,
      // confirm: true,
      // confirmText: 'list.actions.confirm.batch-delete',
    },
    {
      key: 'all-clear',
      type: 'text' as const,
      confirm: true,
      confirmText: 'list.actions.confirm.all-clear',
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
