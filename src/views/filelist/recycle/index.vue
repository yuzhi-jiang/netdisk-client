<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useUserStore } from '@/store';
  import { Message } from '@arco-design/web-vue';
  import { NodeRecord, ReqParams, ReqQueries } from '@/api/filelist';
  import {
    getFileList,
    recoverNodes,
    deleteNodes,
    clearRecycleBox,
    RequestBody,
  } from '@/api/recycle';
  import useVisible from '@/hooks/visible';
  import useLoading from '@/hooks/loading';
  import List from '@/components/list/index.vue';
  import { IAction } from '@/components/list/types';
  import { formatList, formatSize, paramsAdapter } from './utils';
  import useList from './use-list';
  import ModalForm from './components/modal-form.vue';
  import ButtonAction from './components/button-action.vue';

  const $route = useRoute();
  const userStore = useUserStore();
  const { columns, toolbar, actions } = useList();
  const { visible, setVisible } = useVisible();
  const { loading, setLoading } = useLoading();

  const listRef = ref<InstanceType<typeof List>>();
  const modalRef = ref<InstanceType<typeof ModalForm>>();
  const states = {
    reqParams: {} as ReqParams, // request params
    reqQueries: {} as ReqQueries, // request queries
    operation: '',
    requests: [] as RequestBody[],
  };

  const handleOperation = async () => {
    const { operation, requests } = states;
    const cb = operation === '删除' ? deleteNodes : recoverNodes;

    setLoading(true);
    try {
      await cb?.(requests);
      listRef.value?.reload();
      Message.success(`${operation}成功`);
    } finally {
      setLoading(false);
      setVisible(false);
    }
  };
  const handleCancel = () => {
    setVisible(false);
  };

  const onAction = async ({
    action,
    record,
    selectedKeys,
  }: {
    action: IAction;
    record?: NodeRecord;
    selectedKeys?: number[];
  }) => {
    const { key } = action;
    console.log(selectedKeys);
    const diskId = userStore.diskVo?.diskId;
    states.requests = selectedKeys
      ?.filter((fileId) => !!fileId)
      .map((fileId) => ({
        body: {
          fileId,
          diskId,
        },
      })) as any;
    console.log(key, states.requests);
    switch (key) {
      case 'show.info':
        console.log(record);
        modalRef.value?.init(record);
        break;
      case 'batch-recover':
        states.operation = '恢复';
        setVisible(true);
        break;
      case 'batch-delete': {
        states.operation = '删除';
        setVisible(true);
        break;
      }
      case 'all-clear':
        await clearRecycleBox(diskId as string);
        listRef.value?.reload();
        break;
      default:
    }
  };

  const onSuccess = () => {
    listRef.value?.reload();
  };

  const request = async (params = {}) => {
    params = paramsAdapter(params as any, states);
    console.log(params);
    const { data } = await getFileList(params as any);
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
      const { type, parentFileId } = params as ReqParams;
      states.reqParams = { type, parentFileId };
    }
    if (Object.keys(query).length !== 0) {
      const { search } = query as ReqQueries;
      states.reqQueries = { search };
    }
  };
  init();

  document.title = 'Netdisk 回收站';
</script>

<template>
  <div>
    <a-space direction="vertical" class="container">
      <!-- <a-breadcrumb :max-count="maxCount" :routes="routes" /> -->
      <List
        ref="listRef"
        :toolbar="toolbar"
        :columns="columns"
        :actions="[]"
        :request="request"
        row-key="fileId"
        @action="onAction"
      >
        <!-- acions.key -->
        <template #batch-recover="{ action, onAction }: any">
          <ButtonAction
            :action="action"
            :on-action="onAction"
            icon="icon-huifu1"
            name="list.actions.batch-recover"
          />
        </template>

        <template #batch-delete="{ action, onAction }: any">
          <ButtonAction
            :action="action"
            :on-action="onAction"
            icon="icon-shanchu"
            icon-size="17"
            name="list.actions.batch-delete"
          />
        </template>

        <template #all-clear="{ action, onAction }: any">
          <ButtonAction
            :action="action"
            :on-action="onAction"
            icon="icon-qingkong2"
            icon-size="14"
            name="list.actions.all-clear"
          />
        </template>

        <template #fileName="{ row, record }">
          <!-- :to="`/filelist/all/${record.type}/${record.id}`" -->
          <a-typography
            class="netdisk-table-tr__name"
            @click.stop="
              onAction({
                action: { key: 'show.info' },
                record,
              })
            "
          >
            <IconFont
              :type="
                record.type === 'folder' ? 'icon-wenjianjia2' : 'icon-file2'
              "
              :size="18"
              style="vertical-align: sub"
            />
            <span style="margin-left: 6px">{{ row }}</span>
          </a-typography>
        </template>

        <!-- you can formatSize in formatList -->
        <template #size="{ row, record }">
          <span v-if="record.type === 'file'" class="netdisk-table-tr__size">
            {{ formatSize(row) }}
          </span>
        </template>
      </List>
    </a-space>
    <a-modal
      :visible="visible"
      :ok-loading="loading"
      :closable="!loading"
      @ok="handleOperation"
      @cancel="handleCancel"
    >
      <template #title> 提示 </template>
      <div> 是否确认{{ states.operation }} </div>
    </a-modal>
    <ModalForm ref="modalRef" @success="onSuccess" />
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
        border-bottom-color: rgb(226 226 226 / 30%);
      }

      .arco-auto-tooltip:has(.netdisk-table-tr__size) {
        // float: right;
        text-align: right;
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
