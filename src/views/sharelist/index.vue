<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { NodeRecord } from '@/api/filelist';
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
  <div>
    <a-space direction="vertical" class="container">
      <!-- <a-breadcrumb :max-count="maxCount" :routes="routes" /> -->
      <List
        ref="listRef"
        :toolbar="toolbar"
        :columns="columns"
        :actions="[]"
        :request="request"
        :before-request="beforeRequest"
        row-key="fileId"
        @action="onAction"
      >
        <template #batch-transfer="{ action, onAction }: any">
          <ButtonAction
            :action="action"
            :on-action="onAction"
            icon="icon-fuzhi5"
            icon-size="17"
            name="list.actions.batch-transfer"
          />
        </template>

        <template #watch-netdisk="{ action, onAction }: any">
          <ButtonAction
            :action="action"
            :on-action="onAction"
            icon="icon-zhuye"
            icon-size="17"
            name="list.actions.watch-netdisk"
          />
        </template>

        <template #fileName="{ row, record }">
          <router-link
            :to="`/sharelist/${record.shareId}/${record.fileId}`"
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

    <MoveForm
      ref="moveRef"
      :request="saveOtherShares"
      @success="onSuccess"
    ></MoveForm>

    <a-modal
      :visible="visible"
      :closable="false"
      :ok-loading="loading"
      title-align="start"
      hide-cancel
      @ok="handleToken"
    >
      <template #title> 输入密码 </template>
      <a-form :model="form">
        <a-form-item
          label="密码"
          field="sharePwd"
          :rules="{
            required: true,
            message: '请输入密码',
          }"
          validate-trigger="input"
        >
          <a-input v-model="form.sharePwd" placeholder="请输入密码" />
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
</style>
