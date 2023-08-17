<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NodeRecord, getFileDownloadLink } from '@/api/filelist';
import {
  IShareRouteReqParams,
  getShareToken,
  getShareInfo,
  getOtherShares,
  putOtherShares,
} from '@/api/shares';
import List from '@/components/list/index.vue';
import { IAction } from '@/components/list/types';
import MoveForm from '@/views/components/move-form.vue';
import { useUserStore, useShareListStore } from '@/store';
import { Message } from '@arco-design/web-vue';
import useVisible from '@/hooks/visible';
import useLoading from '@/hooks/loading';
import { formatList, formatSize, paramsAdapter } from './utils';
import useList from './use-list';
import ButtonAction from './components/button-action.vue';

const $route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const shareStore = useShareListStore();
const { columns, toolbar, actions } = useList();
const { visible, setVisible } = useVisible();
const { loading, setLoading } = useLoading();
const listRef = ref<InstanceType<typeof List>>();
const moveRef = ref<InstanceType<typeof MoveForm>>();
const form = ref({
  sharePwd: '' as string,
});
const states = {
  reqParams: {} as IShareRouteReqParams, // request params
  moveableFileDiskId: '' as string,
};

const getNodeLink = (record: any): string => {
  if (record.type === 'file') return '';
  return `/sharelist/${record.shareId}/${record.fileId}`;
};
const previewUrlConfig = ref({
  url: '' as string,
  visible: false,
});
const handlePreview = async (record: NodeRecord): Promise<void> => {
  console.log(record);
  const { diskId, fileId } = record;
  const { data } = await getFileDownloadLink({ diskId, fileId } as any);

  // https://docs.google.com/viewer?url=http://arm.todayto.com:8888/file/get/id?fileId=94058be9b5ea4d978791b37a791bb971
  const baseUrl = 'http://175.178.167.193:8012/onlinePreview?url=';
  let googlepreviewUrl = 'https://docs.google.com/viewer?url=';
  let officepreviewUrl = 'https://view.officeapps.live.com/op/view.aspx?src='
  const hostUrl = 'http://line.yefeng.love:9527/file/get/id?fileId='; // baseUrl+previewUrl

  const fullUrl = `${hostUrl}${data.fileId}&fullfilename=${data.fileName}`;
  const bytes = new TextEncoder().encode(fullUrl);
  const byteArray = Array.from(bytes);
  // 对字节序列进行 Base64 编码
  const base64 = btoa(String.fromCharCode.apply(null, byteArray));
  previewUrlConfig.value.url = `${baseUrl}${base64}`;
  googlepreviewUrl = `${googlepreviewUrl}${fullUrl}`;
  // previewUrlConfig.value.url = 'https://docs.google.com/viewer?url=http://arm.todayto.com:8888/file/get/id?fileId=a3445ffb01a046fd8295c49a5332813a'
  previewUrlConfig.value.visible = true;
  // window.open(googlepreviewUrl)
  // window.open('https://docs.google.com/viewer?url=http://arm.todayto.com:8888/file/get/id?fileId=a3445ffb01a046fd8295c49a5332813a')
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
  const diskId = userStore.$state.diskVo?.diskId;
  // console.log('userStore', diskId);
  selectedKeys = selectedKeys?.filter((fileId) => !!fileId);
  switch (key) {
    case 'batch-transfer':
      moveRef.value?.init({
        diskId,
        selectedKeys,
        moveableFileDiskId: diskId,
      } as any);
      break;

    case 'watch-netdisk':
      // redirectHome();
      router.push({
        name: 'filelist',
      });
      break;
    default:
      break;
  }
};

const saveOtherShares = async (formv: any) => {
  return putOtherShares(formv, shareStore.shareToken as string);
};

const onSuccess = () => {
  Message.success('操作成功');
  listRef.value?.reload();
};

/**
 * 获取token
 * 从 form 中取出输入的密码
 * 从 states 中 获取请求参数 shareId
 */
const handleToken = async () => {
  /**
   * 先判断是否有Token
   * 如果已经有Token则不请求
   */
  if (shareStore.shareToken) return;

  const {
    reqParams: { shareId },
  } = states;
  const { sharePwd } = form.value;
  shareStore.setSharePwd(sharePwd);

  try {
    setLoading(true);
    const {
      data: { shareToken },
    } = await getShareToken({ shareId, sharePwd });
    shareStore.setShareToken(shareToken);
    setVisible(false);

    /**
     * 如果是具有密码的，那么此时应该reload，因为request已经过了
     */
    if (shareStore.hasPwd) {
      await listRef.value?.reload();
    }
  } catch (e) {
    setVisible(true);
  } finally {
    setLoading(false);
  }
};

/**
 * 获取请求信息，是否需要密码
 * 需要密码则弹窗输入密码
 * 如不需要密码直接请求token
 */
const beforeRequest = async () => {
  /**
   * 先判断是否需要密码
   * 如果不需要密码 || 需要密码 & 存在密码
   */
  console.log(shareStore.hasPwd, shareStore.sharePwd);
  if (!shareStore.hasPwd || (shareStore.hasPwd && shareStore.sharePwd))
    return;

  const {
    reqParams: { shareId },
  } = states;
  const {
    data: { hasPwd },
  } = await getShareInfo(shareId);
  shareStore.setHasPwd(hasPwd);

  if (hasPwd) {
    /**
     * 此时request已经过去，需要手动刷新
     */
    setVisible(true);
    return;
  }

  /**
   * 无密码直接请求
   */
  await handleToken();
};

const request = async (params = {}) => {
  /**
   * 处理密码情况
   */
  const { hasPwd, sharePwd, shareToken } = shareStore;
  if (hasPwd && !sharePwd) {
    setVisible(true);
    return {
      data: [],
      total: 0,
    };
  }

  params = paramsAdapter(params as any, states);
  const { data } = await getOtherShares(params as any, shareToken as string);
  if (data?.list) {
    const res = formatList(data.list);
    states.moveableFileDiskId = res[0].diskId as string;
    return {
      // must be format
      data: res,
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
   * current route is sharelist/:shareId/:parentFileId
   */
  const { params, query } = $route;

  if (Object.keys(params).length !== 0) {
    // console.log(params);
    const { shareId, parentFileId } = params as any;
    states.reqParams.shareId = shareId;
    states.reqParams.parentFileId = parentFileId;
  }
};
init();

document.title = 'Netdisk 分享';
</script>

<template>
  <div class="preview-wrapper" :style="{
    display: previewUrlConfig.visible ? 'flex' : 'none',
  }">
    <div class="modal-mask"></div>
    <div class="preview-content">
      <div class="preview-header">
        <button class="close-btn" type="button" @click="hidePreview">&times;</button>
        <!-- <div class="preview-cancel-button" @click="hidePreview">取消</div> -->
      </div>
      <iframe :src="previewUrlConfig.url"></iframe>
    </div>
  </div>

  <div>
    <a-space direction="vertical" class="container">
      <!-- <a-breadcrumb :max-count="maxCount" :routes="routes" /> -->
      <List ref="listRef" :toolbar="toolbar" :columns="columns" :actions="[]" :request="request"
        :before-request="beforeRequest" row-key="fileId" @action="onAction">
        <template #batch-transfer="{ action, onAction }: any">
          <ButtonAction :action=" action " :on-action=" onAction " icon="icon-fuzhi5" icon-size="17"
            name="list.actions.batch-transfer" />
        </template>

        <template #watch-netdisk=" { action, onAction }: any ">
          <ButtonAction :action=" action " :on-action=" onAction " icon="icon-zhuye" icon-size="17"
            name="list.actions.watch-netdisk" />
        </template>

        <template #fileName=" { row, record } ">
          <!-- <router-link :to=" `/sharelist/${record.shareId}/${record.fileId}` " class="netdisk-table-tr__name"> -->

          <router-link :to=" getNodeLink(record) " class="netdisk-table-tr__name" @click.stop="
            record.type === 'file' ? handlePreview(record) : () => { }
          ">
            <IconFont :type="
              record.type === 'folder' ? 'icon-wenjianjia2' : 'icon-file2'
            " :size=" 18 " style="vertical-align: sub" />
            <span style="margin-left: 6px">{{ row }}</span>
          </router-link>
        </template>

        <!-- you can formatSize in formatList -->
        <template #length=" { row, record } ">
          <span v-if=" record.type === 'file' " class="netdisk-table-tr__size">
            {{ formatSize(row) }}
          </span>
        </template>
      </List>
    </a-space>

    <MoveForm ref="moveRef" :request=" saveOtherShares " @success=" onSuccess "></MoveForm>

    <a-modal :visible=" visible " :closable=" false " :ok-loading=" loading " title-align="start" hide-cancel
      @ok=" handleToken ">
      <template #title> 输入密码 </template>
      <a-form :model=" form ">
        <a-form-item label="密码" field="sharePwd" :rules="
          {
            required: true,
              message: '请输入密码',
                                                                                                                  }
        " validate-trigger="input">
          <a-input v-model=" form.sharePwd " placeholder="请输入密码" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
.container {
  display: flex;
  height: 100vh;
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

