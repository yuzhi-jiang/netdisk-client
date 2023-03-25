<script setup lang="ts">
  import { ref } from 'vue';
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
  import { useUserStore } from '@/store';
  import useVisible from '@/hooks/visible';
  import useLoading from '@/hooks/loading';
  import { formatList, formatSize, paramsAdapter } from './utils';
  import useList from './use-list';
  import ButtonAction from './components/button-action.vue';

  const $route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
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
    shareToken: '' as string,
    hasPwd: true,
    sharePwd: '' as string,
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

  const onSuccess = () => {
    listRef.value?.reload();
  };

  /**
   * 获取token
   * 从 form 中取出输入的密码
   * 从 states 中 获取请求参数 shareId
   */
  const handleToken = async () => {
    const {
      reqParams: { shareId },
    } = states;
    const { sharePwd } = form.value;
    states.sharePwd = sharePwd;

    try {
      setLoading(true);
      const {
        data: { shareToken },
      } = await getShareToken({ shareId, sharePwd });
      states.shareToken = shareToken;
      setVisible(false);
      listRef.value?.reload();
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
    const {
      reqParams: { shareId },
    } = states;
    const {
      data: { hasPwd },
    } = await getShareInfo(shareId);
    states.hasPwd = hasPwd;
    // const hasPwd = true;

    if (hasPwd) {
      setVisible(true);
      return;
    }
    await handleToken();
  };

  const request = async (params = {}) => {
    params = paramsAdapter(params as any, states);
    // console.log(params);

    /**
     * 处理密码情况
     */
    const { hasPwd, sharePwd } = states;
    if (hasPwd && !sharePwd) {
      setVisible(true);
      return {
        data: [],
        total: 0,
      };
    }

    const { data } = await getOtherShares(params as any, states.shareToken);
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
      console.log(params);
      const { shareId, parentFileId } = params as any;
      states.reqParams = { shareId, parentFileId };
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
      :request="putOtherShares"
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
