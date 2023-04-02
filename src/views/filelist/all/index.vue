<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { IconMore } from '@arco-design/web-vue/es/icon';
  import {
    NodeRecord,
    ReqParams,
    ReqQueries,
    getFileList,
    getFileDownloadLink,
    moveNodes,
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
  import UploadForm from './components/upload-form.vue';
  import MoveForm from '../../components/move-form.vue';
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
  const moveRef = ref<InstanceType<typeof MoveForm>>();
  const uploadRef = ref<InstanceType<typeof UploadForm>>();
  const states = {
    reqParams: {} as ReqParams, // request params
    reqQueries: {} as ReqQueries, // request queries
    requests: [] as any,
    data: {} as any,
  };
  const previewUrlConfig = ref({
    url: '' as string,
    visible: false,
  });

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

  const getNodeLink = (record: NodeRecord): string => {
    if (record.type === 'file') return '';
    return `/filelist/all/${record.type}/${record.fileId}`;
  };

  const handlePreview = async (record: NodeRecord): Promise<void> => {
    console.log(record);
    const { diskId, fileId } = record;
    const { data } = await getFileDownloadLink({ diskId, fileId } as any);

    // https://docs.google.com/viewer?url=http://arm.todayto.com:8888/file/get/id?fileId=94058be9b5ea4d978791b37a791bb971
    const baseUrl = 'http://175.178.167.193:8012/onlinePreview?url=';
    const hostUrl = 'http://arm.todayto.com:8888/file/get/id?fileId='; // baseUrl+previewUrl

    const fullUrl = `${hostUrl}${data.fileId}&fullfilename=${data.fileName}`;
    const bytes = new TextEncoder().encode(fullUrl);
    const byteArray = Array.from(bytes);
    // 对字节序列进行 Base64 编码
    const base64 = btoa(String.fromCharCode.apply(null, byteArray));
    previewUrlConfig.value.url = `${baseUrl}${base64}`;
    previewUrlConfig.value.visible = true;

    console.log(data);
  };
  const hidePreview = async () => {
    previewUrlConfig.value.url = '';
    previewUrlConfig.value.visible = false;
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
        uploadRef.value?.init();
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
        moveRef.value?.init({
          diskId,
          selectedKeys,
          moveableFileDiskId: diskId,
        } as any);
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
  <div
    class="preview-wrapper"
    :style="{
      display: previewUrlConfig.visible ? 'flex' : 'none',
    }"
  >
    <div class="modal-mask"></div>
    <div class="preview-content">
      <div class="preview-header">
        <button class="close-btn" type="button" @click="hidePreview"
          >&times;</button
        >
        <!-- <div class="preview-cancel-button" @click="hidePreview">取消</div> -->
      </div>
      <iframe :src="previewUrlConfig.url"></iframe>
    </div>
  </div>

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
            :to="getNodeLink(record)"
            class="netdisk-table-tr__name"
            @click.stop="
              record.type === 'file' ? handlePreview(record) : () => {}
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
    <MoveForm ref="moveRef" :request="moveNodes" @success="onSuccess" />
    <UploadForm ref="uploadRef" />
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

  .preview-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
  }

  .modal-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(0 0 0 / 50%);
  }

  .preview-content {
    position: relative;
    z-index: 1;
    width: 80%;
    height: 80%;
    max-height: 80%;
    max-height: 90%;
  }

  .preview-content iframe {
    width: 100%;
    height: 100%;
  }

  .preview-header {
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    height: 40px;
    background-color: #f1f1f1;
    border-radius: 5px 0 0;
  }

  .preview-cancel-button {
    margin-right: 10px;
    padding: 8px;
    color: #555;
    font-weight: bold;
    font-size: 14px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
    cursor: pointer;
  }

  .close-btn {
    position: absolute;

    /* 设置为绝对定位，以便在右上角显示 */
    top: 10px;
    right: 10px;
    color: #999;

    /* 设置颜色 */
    font-size: 1.5rem;

    /* 设置大小 */
    font-family: Arial, sans-serif;

    /* 设置字体 */
    background: none;

    /* 去掉背景 */
    border: none;

    /* 去掉边框 */
    cursor: pointer;

    /* 设置鼠标样式 */
  }
</style>
