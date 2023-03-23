<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { IconMore } from '@arco-design/web-vue/es/icon';
  import {
    NodeRecord,
    ReqParams,
    ReqQueries,
    getFileList,
  } from '@/api/filelist';
  import { addNodes } from '@/api/recycle';
  import { useUserStore } from '@/store';
  import List from '@/components/list/index.vue';
  import { IAction } from '@/components/list/types';
  import useLoading from '@/hooks/loading';
  import useVisible from '@/hooks/visible';
  import { Message } from '@arco-design/web-vue';
  import { IPostShareNode } from '@/api/shares';
  import { formatList, formatSize, paramsAdapter } from './utils';
  import useList from './use-list';
  import useInput from './use-input';
  import useTrigger from './use-trigger';
  import ModalForm from './components/modal-form.vue';
  import ShareForm from './components/share-form.vue';
  import ButtonAction from './components/button-action.vue';

  const $route = useRoute();
  const userStore = useUserStore();
  const { loading, setLoading } = useLoading();
  const { visible, setVisible } = useVisible();
  const { columns, toolbar, actions } = useList();
  const { content, clearInput, okSearch } = useInput();
  const { triggers } = useTrigger();
  const listRef = ref<InstanceType<typeof List>>();
  const modalRef = ref<InstanceType<typeof ModalForm>>();
  const shareRef = ref<InstanceType<typeof ShareForm>>();
  const states = {
    reqParams: {} as ReqParams, // request params
    reqQueries: {} as ReqQueries, // request queries
    requests: [] as any,
    data: {} as any,
  };

  const handleOperation = async () => {
    setLoading(true);
    try {
      await addNodes(states.requests);
      listRef.value?.reload();
      Message.success('删除成功');
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
    record?: NodeRecord;
    selectedKeys?: number[];
  }) => {
    const { key } = action;
    const diskId = userStore.diskVo?.diskId;
    selectedKeys = selectedKeys?.filter((fileId) => !!fileId);
    states.requests = selectedKeys?.map((fileId) => ({
      body: {
        fileId,
        diskId,
      },
    }));
    switch (key) {
      case 'create.dir': {
        const val = {
          ...states.reqParams,
          diskId: userStore.$state.diskVo?.diskId,
        };
        modalRef.value?.init(val);
        break;
      }
      case 'upload.file':
      case 'upload.dir':
        break;
      case 'batch-delete':
        setVisible(true);
        break;
      case 'create-share':
        shareRef.value?.init(
          {
            diskId,
            fileIdList: selectedKeys,
          } as Partial<IPostShareNode>,
          states.data
        );
        break;
      case 'create-move':
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
    const { data } = await getFileList(params);
    if (data?.list) {
      states.data = formatList(data.list);
      return {
        // must be format
        data: states.data,
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

  document.title = 'Netdisk 首页';
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

        <!-- acions.key -->
        <template #create="{ action }: any">
          <a-popover position="bl">
            <a-button
              v-if="action.trigger"
              :type="action.type || 'primary'"
              :status="action.status || 'normal'"
            >
              <template #icon>
                <icon-more />
              </template>
            </a-button>
            <template #content>
              <a-list
                size="small"
                :bordered="false"
                :split="false"
                hoverable
                style="user-select: none"
              >
                <a-list-item
                  v-for="item in triggers"
                  :key="item.label"
                  style="padding: 4px"
                  @click.stop="onAction({ action: { key: item.key } } as any)"
                >
                  <a-link style="color: rgb(var(--gray-10))" :hoverable="false">
                    <template #icon>
                      <IconFont
                        :type="item.icon"
                        :size="20"
                        style="vertical-align: middle"
                      />
                    </template>
                    {{ $t(item.label) }}
                  </a-link>
                </a-list-item>
              </a-list>
            </template>
          </a-popover>
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

        <template #create-share="{ action, onAction }: any">
          <ButtonAction
            :action="action"
            :on-action="onAction"
            icon="icon-fenxiang2"
            icon-size="17"
            name="list.actions.create-share"
          />
        </template>

        <template #create-move="{ action, onAction }: any">
          <ButtonAction
            :action="action"
            :on-action="onAction"
            icon="icon-jiandaojianqie"
            icon-size="17"
            name="list.actions.create-move"
          />
        </template>

        <template #fileName="{ row, record }">
          <router-link
            :to="`/filelist/all/${record.type}/${record.fileId}`"
            class="netdisk-table-tr__name"
          >
            <IconFont
              :type="
                record.type === 'folder' ? 'icon-wenjianjia2' : 'icon-file2'
              "
              :size="18"
              style="vertical-align: sub"
            />
            <span style="margin-left: 6px">{{ row }}</span>
          </router-link>
        </template>

        <!-- you can formatSize in formatList -->
        <template #length="{ row, record }">
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
      <div> 是否确认删除 </div>
    </a-modal>
    <ShareForm ref="shareRef" @success="onSuccess"></ShareForm>
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
