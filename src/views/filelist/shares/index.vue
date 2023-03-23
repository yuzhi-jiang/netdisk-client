<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { ReqParams, ReqQueries } from '@/api/filelist';
  import {
    DeleteNodeRecord,
    ShareNodeRecord,
    getShareList,
    deleteShareNodes,
    clearShareBox,
  } from '@/api/shares';
  import { useUserStore } from '@/store';
  import List from '@/components/list/index.vue';
  import { IAction } from '@/components/list/types';
  import useVisible from '@/hooks/visible';
  import useLoading from '@/hooks/loading';
  import { formatList, formatSize, paramsAdapter } from './utils';
  import useList from './use-list';
  import ModalForm from './components/modal-form.vue';
  import ButtonAction from './components/button-action.vue';

  const $route = useRoute();
  const { columns, toolbar, actions } = useList();
  const userStore = useUserStore();
  const { loading, setLoading } = useLoading();
  const { visible, setVisible } = useVisible();
  const listRef = ref<InstanceType<typeof List>>();
  const modalRef = ref<InstanceType<typeof ModalForm>>();
  const states = {
    reqParams: {} as ReqParams, // request params
    reqQueries: {} as ReqQueries, // request queries
    deleteNodes: {} as DeleteNodeRecord,
  };

  const handleBatchDelete = async () => {
    setLoading(true);
    try {
      await deleteShareNodes(states.deleteNodes);
      listRef.value?.reload();
    } finally {
      setLoading(false);
      setVisible(false);
    }
  };

  const handleCancel = () => {
    setLoading(false);
    setVisible(false);
  };

  const onAction = async ({
    action,
    record,
    selectedKeys,
  }: {
    action: IAction;
    record?: ShareNodeRecord;
    selectedKeys?: string[];
  }) => {
    const { key } = action;
    const diskId = userStore.$state.diskVo?.diskId as string;
    const shareIds = selectedKeys?.filter((shareId) => !!shareId) as string[];
    switch (key) {
      case 'show.info':
        console.log(record);
        modalRef.value?.init(record);
        break;
      case 'batch-delete':
        setVisible(true);
        states.deleteNodes = { diskId, shareIds };
        break;
      case 'all-clear':
        await clearShareBox(diskId);
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
    const { data } = await getShareList(params);
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
  <div>
    <a-space direction="vertical" class="container">
      <!-- <a-breadcrumb :max-count="maxCount" :routes="routes" /> -->
      <List
        ref="listRef"
        :toolbar="toolbar"
        :columns="columns"
        :actions="[]"
        :request="request"
        row-key="shareId"
        @action="onAction"
      >
        <!-- acions.key -->
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

        <template #shareTitle="{ row, record }">
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
      @ok="handleBatchDelete"
      @cancel="handleCancel"
    >
      <template #title> 提示 </template>
      <div> 是否确认删除 </div>
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
