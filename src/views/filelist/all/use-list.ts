import { useI18n } from 'vue-i18n';
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
      // defaultSortOrder: 'descend' as const,
      width: 100,
    },
  ];

  return { columns };
}
