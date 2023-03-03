<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { ReqParams, getFileList } from '@/api/filelist';
  import List from '@/components/list/index.vue';
  import { formatList, formatSize, paramsAdapter } from './utils';
  import useList from './use-list';
  import useMaxCount from './use-max-count';

  const { columns, toolbar, actions } = useList();
  const { routes, maxCount } = useMaxCount();
  const listRef = ref<InstanceType<typeof List>>();
  const states = {
    reqParams: {} as ReqParams, // request params
  };

  const onSuccess = () => {
    listRef.value?.reload();
  };

  const request = async (params = {}) => {
    params = paramsAdapter(params, states.reqParams);
    console.log(params);
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

  /**
   * 指定路由进入渲染，携带参数
   * current route is filelist/all/:type/:parent_id
   */
  const $route = useRoute();
  const { params, query } = $route;
  if (Object.keys(params).length !== 0) {
    // appoint a folder, can't find a way to define the route type
    const { type, parentId } = params as ReqParams;
    states.reqParams = { type, parentId };
  }
</script>

<template>
  <a-space direction="vertical" class="container">
    <a-breadcrumb :max-count="maxCount" :routes="routes" />
    <List
      ref="listRef"
      :toolbar="toolbar"
      :columns="columns"
      :request="request"
    >
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

      <!-- you can formatSize in formatList -->
      <template #size="{ row }">
        <span class="netdisk-table-tr__size">{{ formatSize(row) }}</span>
        <!-- <span style="float: right; text-align: right"> -->
        <!-- <a-tooltip style="float: right; text-align: right">{{ formatSize(row) }}</a-tooltip> -->
        <!-- </span> -->
      </template>
    </List>
  </a-space>
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

  ::v-deep {
    .arco-auto-tooltip:has(.netdisk-table-tr__size) {
      // float: right;
      text-align: right;
    }
  }
</style>
