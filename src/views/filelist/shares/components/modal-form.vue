<script setup lang="ts">
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import { IconDelete } from '@arco-design/web-vue/es/icon';
  import useVisible from '@/hooks/visible';
  import useLoading from '@/hooks/loading';
  import {
    DeleteNodeRecord,
    ShareNodeRecord,
    deleteShareNodes,
  } from '@/api/shares';

  const emits = defineEmits(['success']);

  const { t } = useI18n();
  const { visible, setVisible } = useVisible();
  const { loading, setLoading } = useLoading();

  type IOption = {
    label: string;
    value: string;
  };
  const options = ref<IOption[]>();
  const raw = ref<ShareNodeRecord>();
  const deleteNodes = ref<DeleteNodeRecord>();

  const close = () => {
    setVisible(false);
    options.value = [];
    raw.value = undefined;
  };

  const onConfirm = async (type: 'delete') => {
    setLoading(true);
    try {
      await deleteShareNodes(deleteNodes.value as DeleteNodeRecord);
      close();
      emits('success');
      Message.success(t('message.operationSuccess'));
    } finally {
      setLoading(false);
    }
  };

  const init = (data: ShareNodeRecord | any) => {
    raw.value = data;
    deleteNodes.value = {
      diskId: data.diskId,
      shareIds: [data.shareId],
    };
    setVisible(true);
    setLoading(true);
    options.value = Object.keys(data).map<IOption>((key) => {
      const value = data[key];
      return { label: key, value };
    });
    setLoading(false);
  };

  defineExpose({ init });
</script>

<template>
  <a-modal
    v-model:visible="visible"
    :title="raw?.shareTitle"
    :footer="false"
    :unmount-on-close="true"
    title-align="start"
  >
    <a-card :title="raw?.type?.toLocaleUpperCase()" :bordered="false">
      <template #title>
        <a-tag>{{ raw?.type?.toUpperCase() }}</a-tag>
      </template>
      <template #extra>
        <a-space>
          <a-tooltip :content="$t('recycle.button.delete')" position="top" mini>
            <a-button
              size="mini"
              :loading="loading"
              @click="onConfirm('delete')"
            >
              <template #icon>
                <IconDelete size="20" />
              </template>
            </a-button>
          </a-tooltip>
        </a-space>
      </template>
      <a-descriptions
        :data="options"
        :column="1"
        table-layout="fixed"
        size="large"
        style="margin-top: 6px"
      />
    </a-card>
  </a-modal>
</template>
