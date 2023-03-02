<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { listenerRouteChange } from '@/utils/route-listener';
  import { getFileList } from '@/api/filelist';
  import type { NodeRecord } from '@/api/filelist';
  import List from '@/components/list/index.vue';
  import useColumns from './use-columns';

  const { columns } = useColumns();

  const listRef = ref<InstanceType<typeof List>>();

  const onSuccess = () => {
    listRef.value?.reload();
  };

  const formatList = (list: NodeRecord[]) => {
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

  const request = async (params = {}) => {
    const { data } = await getFileList(params);
    if (data?.list) {
      return {
        data: formatList(data.list),
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
    <List ref="listRef" :columns="columns" :request="request">
      <template #name="{ row, record }">
        <a href="/" class="netdisk-table-tr__name">
          <IconFont
            :type="record.type === 'folder' ? 'icon-wenjianjia2' : 'icon-file2'"
            :size="18"
            style="vertical-align: sub"
          />
          {{ row }}
        </a>
      </template>
    </List>
  </div>
</template>

<style lang="less" scoped>
  .container {
    display: flex;
    padding: 16px 20px;
    padding-bottom: 0;
    background-color: var(--color-fill-2);

    ::v-deep {
      .arco-table-td {
        font-size: 13px;
      }
    }
  }

  .netdisk-table-tr__name {
    color: rgb(var(--gray-10));
    font-size: 13px;
    text-decoration: none;
    cursor: pointer;
  }
</style>
