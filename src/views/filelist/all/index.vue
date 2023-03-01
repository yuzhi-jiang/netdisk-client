<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { getFileList } from '@/api/filelist';
  import { listenerRouteChange } from '@/utils/route-listener';
  import List from '@/components/list/index.vue';

  const { t, d } = useI18n();

  const columns = [
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

  const listRef = ref<InstanceType<typeof List>>();

  const onSuccess = () => {
    listRef.value?.reload();
  };

  const request = async (params = {}) => {
    const { data } = await getFileList(params);
    console.log(data);
    if (data?.list) {
      return {
        data: data.list,
        total: data.total,
      };
    }
    return {
      data: [],
      total: 0,
    };
  };
</script>

<template>
  <div class="container">
    <List ref="listRef" :columns="columns" :request="request" />
    <!-- :toolbar="toolbar"
      :actions="actions"
      @action="onAction" -->
  </div>
</template>

<style lang="less" scoped>
  .container {
    display: flex;
    padding: 16px 20px;
    padding-bottom: 0;
    background-color: var(--color-fill-2);
  }

  .left-side {
    flex: 1;
    overflow: auto;
  }

  .right-side {
    width: 280px;
    margin-left: 16px;
  }

  .panel {
    overflow: auto;
    background-color: var(--color-bg-2);
    border-radius: 4px;
  }
</style>
