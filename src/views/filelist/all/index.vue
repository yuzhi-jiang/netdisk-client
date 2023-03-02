<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { listenerRouteChange } from '@/utils/route-listener';
  import { getFileList } from '@/api/filelist';
  import List from '@/components/list/index.vue';
  import { formatList } from './utils';
  import useColumns from './use-columns';
  import useMaxCount from './use-max-count';

  const { columns } = useColumns();
  const { routes, maxCount } = useMaxCount();

  const listRef = ref<InstanceType<typeof List>>();

  const onSuccess = () => {
    listRef.value?.reload();
  };

  const getPath = (id: string, parentId: string) => {};

  const request = async (params = {}) => {
    const { data } = await getFileList(params);
    if (data?.list) {
      return {
        // must be format
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
        <!-- :href="`/#/filelist/all/${record.type}/${record.id}`" -->
        <router-link
          :to="`/filelist/all/${record.type}/${record.id}`"
          class="netdisk-table-tr__name"
        >
          <IconFont
            :type="record.type === 'folder' ? 'icon-wenjianjia2' : 'icon-file2'"
            :size="18"
            style="vertical-align: sub"
          />
          <!-- {{ row }} -->
          <span style="margin-left: 6px">{{ row }}</span>
        </router-link>
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
