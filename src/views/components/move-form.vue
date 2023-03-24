<script setup lang="ts">
  import { ref, h } from 'vue';
  import { TreeNodeData } from '@arco-design/web-vue';
  import useVisible from '@/hooks/visible';
  import useLoading from '@/hooks/loading';
  import { useUserStore } from '@/store';
  import { IconEmpty } from '@arco-design/web-vue/es/icon';
  import { NodeRecord, getFileList, ReqParams, IForm } from '@/api/filelist';
  import { redirectLogin } from '@/router/utils';

  type ITreeNodeData = NodeRecord & TreeNodeData;
  interface IProps {
    request: (form: IForm) => Promise<any>;
  }

  const props = defineProps<IProps>();

  const emits = defineEmits(['success']);

  const { visible, setVisible } = useVisible();
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();

  const toParentFileIds = ref<string[]>();
  const states = {
    diskId: '' as string, // 用户自身diskid
    moveableFileDiskId: '' as string, // 转存文件的原有diskid
    selectedKeys: new Set<string>(), // 原有文件id
  };

  const treeData = ref<ITreeNodeData[]>();

  const getTreeData = async (params: ReqParams): Promise<ITreeNodeData[]> => {
    setLoading(true);
    try {
      const { data } = await getFileList(params);
      if (data.list) {
        /**
         * 移动内容时，不能将其移动到本内容文件夹或子文件夹中
         * 同时移动多个内容也是同理，不能移动到已选择移动的内容中，要么单独移动，要么不移动
         * 已选择的移动内容 fileId 由 states.selectedKeys 记录
         */
        const { selectedKeys } = states;
        return data.list
          .filter((item) => item.type === 'folder')
          .map((item: ITreeNodeData) => {
            if (selectedKeys.has(item.fileId as string)) {
              item.disabled = true;
              item.selectable = false;
            }
            return item;
          });
      }
    } finally {
      setLoading(false);
    }
    return [];
  };

  const loadMore = async (nodeData: ITreeNodeData): Promise<void> => {
    const diskId = userStore.$state.diskVo?.diskId;
    const { fileId } = nodeData;

    const params = {
      pageNum: 1,
      pageSize: 10000,
      diskId,
      parentFileId: fileId,
    };

    const data = await getTreeData(params);

    if (data.length === 0) {
      nodeData.isLeaf = true;
      // nodeData.icon = () => h(IconFolder) as any;
      nodeData.switcherIcon = () => h(IconEmpty) as any;
    }

    nodeData.children = data;
  };

  const close = () => {
    setVisible(false);
    treeData.value = undefined;
  };

  const onSubmit = async () => {
    const toParentFileId = toParentFileIds.value?.[0] as string;
    const { selectedKeys, moveableFileDiskId, diskId } = states;

    const requests = [] as IForm['requests'];

    selectedKeys.forEach((item) => {
      requests.push({
        body: {
          fileId: item,
          diskId: moveableFileDiskId,
          toDiskId: diskId,
          toParentFileId,
        },
        fileId: item,
      });
    });

    const form = { diskId, requests } as IForm;

    setLoading(true);
    try {
      await props.request(form);
      emits('success');
      close();
    } finally {
      setLoading(false);
    }
  };

  const init = async (initData: {
    diskId: string;
    moveableFileDiskId: string;
    selectedKeys: string[];
  }) => {
    setVisible(true);
    const { diskId, moveableFileDiskId, selectedKeys = [] } = initData;
    states.diskId = diskId;
    states.moveableFileDiskId = moveableFileDiskId;
    states.selectedKeys = new Set(selectedKeys);
    const params = {
      diskId: userStore.$state.diskVo?.diskId,
      parentFileId: 'root',
      pageNum: 1,
      pageSize: 1000,
    };

    if (!diskId) {
      redirectLogin();
      setVisible(false);
      return;
    }

    const nodeData = await getTreeData(params);
    treeData.value = [
      {
        fileId: 'root',
        fileName: '根目录',
        children: nodeData,
      },
    ];
  };
  defineExpose({ init });
</script>

<template>
  <a-modal
    v-model:visible="visible"
    title="移动内容"
    :footer="false"
    :unmount-on-close="true"
    title-align="start"
  >
    <a-tree
      v-model:selected-keys="toParentFileIds"
      :data="treeData"
      :load-more="loadMore"
      :field-names="{
        key: 'fileId',
        title: 'fileName',
      }"
      show-line
    />

    <a-space style="margin-top: 10px">
      <a-button :loading="loading" @click="onSubmit">
        {{ $t('form.actions.submit') }}
      </a-button>
      <a-button @click="close">
        {{ $t('form.actions.cancel') }}
      </a-button>
    </a-space>
  </a-modal>
</template>

<style lang="less" scoped>
  .netdisk-move-list-item__content {
    color: rgb(var(--gray-10));
  }
</style>
