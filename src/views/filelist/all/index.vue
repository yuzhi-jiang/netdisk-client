<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import {
    NodeRecord,
    ReqParams,
    ReqQueries,
    getFileList,
  } from '@/api/filelist';
  import List from '@/components/list/index.vue';
  import { IAction } from '@/components/list/types';
  import { formatList, formatSize, paramsAdapter } from './utils';
  import useList from './use-list';
  import useMaxCount from './use-max-count';
  import useInput from './use-input';
  import ModalForm from './components/modal-form.vue';

  const $route = useRoute();
  const { columns, toolbar, actions } = useList();
  const { routes, maxCount } = useMaxCount();
  const { content, clearInput, okSearch } = useInput();
  const listRef = ref<InstanceType<typeof List>>();
  const modalRef = ref<InstanceType<typeof ModalForm>>();
  const states = {
    reqParams: {} as ReqParams, // request params
    reqQueries: {} as ReqQueries, // request queries
  };

  const onAction = async ({
    action,
    record,
    selectedKeys,
  }: {
    action: IAction;
    record: NodeRecord;
    selectedKeys: number[];
  }) => {
    const { key } = action;
    switch (key) {
      case 'create':
        modalRef.value?.init();
        break;
      case 'bulk-delete':
        listRef.value?.reload();
        break;
      default:
    }
  };

  const onSuccess = () => {
    listRef.value?.reload();
  };

  const request = async (params = {}) => {
    params = paramsAdapter(params, states);
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

  const init = () => {
    /**
     * 指定路由进入渲染，携带参数
     * current route is filelist/all/:type/:parent_id
     */
    const { params, query } = $route;
    // appoint a folder, can't find a way to define the route type, like type, parentId
    if (Object.keys(params).length !== 0) {
      const { type, parentId } = params as ReqParams;
      states.reqParams = { type, parentId };
      // get_path() // 获取fullpath
    }
    if (Object.keys(query).length !== 0) {
      const { search } = query as ReqQueries;
      states.reqQueries = { search };
    }
  };
  init();
</script>

<template>
  <a-space direction="vertical" class="container">
    <!-- <a-breadcrumb :max-count="maxCount" :routes="routes" /> -->
    <List
      ref="listRef"
      :toolbar="toolbar"
      :columns="columns"
      :actions="[]"
      :request="request"
      @action="onAction"
    >
      <template #search="{ action }: any">
        <a-input-search
          v-model="content"
          :style="{ width: '280px', marginLeft: '8px' }"
          :placeholder="$t(action.placeholder || '')"
          search-button
          allow-clear
          @press-enter="okSearch(content)"
          @clear="clearInput"
          @search="okSearch(content)"
        />
      </template>

      <template #name="{ row, record }">
        <router-link
          :to="`/filelist/all/${record.type}/${record.id}`"
          class="netdisk-table-tr__name"
        >
          <IconFont
            :type="record.type === 'folder' ? 'icon-wenjianjia2' : 'icon-file2'"
            :size="18"
            style="vertical-align: sub"
          />
          <span style="margin-left: 6px">{{ row }}</span>
        </router-link>
      </template>

      <!-- you can formatSize in formatList -->
      <template #size="{ row, record }">
        <span v-if="record.type === 'file'" class="netdisk-table-tr__size">
          {{ formatSize(row) }}
        </span>
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
        border-bottom-color: rgb(226 226 226 / 30%);
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
