<script setup lang="ts">
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Form, Message } from '@arco-design/web-vue';
  import { IconDelete } from '@arco-design/web-vue/es/icon';
  import useVisible from '@/hooks/visible';
  import useLoading from '@/hooks/loading';
  import type { NodeRecord } from '@/api/filelist';
  import { deleteNodes, recoverNodes } from '@/api/recycle';

  const emits = defineEmits(['success']);

  const { t } = useI18n();
  const { visible, setVisible } = useVisible();
  const { loading, setLoading } = useLoading();

  const loadings = ref({
    delete: false,
    recover: false,
  });

  type IOption = {
    label: string;
    value: string;
  };
  const options = ref<IOption[]>();
  const raw = ref<NodeRecord>();

  const close = () => {
    setVisible(false);
    options.value = [];
    raw.value = undefined;
  };

  const onConfirm = async (type: 'recover' | 'delete') => {
    if (type === 'recover') {
      loadings.value.delete = false;
      loadings.value.recover = true;
    } else {
      loadings.value.delete = true;
      loadings.value.recover = false;
    }

    const { fileId, diskId } = raw.value as any;
    const body = { diskId, fileId };
    try {
      await (type === 'recover'
        ? recoverNodes([{ body }])
        : deleteNodes([{ body }]));
      close();
      emits('success');
      Message.success(t('message.operationSuccess'));
    } finally {
      loadings.value = {
        delete: false,
        recover: false,
      };
    }
  };

  const init = (data: any) => {
    raw.value = data;
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
    :title="raw?.fileName"
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
          <a-tooltip
            :content="$t('recycle.button.recover')"
            position="top"
            mini
          >
            <a-button
              size="mini"
              :loading="loadings.recover"
              :disabled="loadings.recover || loadings.delete"
              @click="onConfirm('recover')"
            >
              <template #icon>
                <IconFont type="icon-huifu2" size="16"></IconFont>
              </template>
            </a-button>
          </a-tooltip>
          <a-tooltip :content="$t('recycle.button.delete')" position="top" mini>
            <a-button
              size="mini"
              :loading="loadings.delete"
              :disabled="loadings.recover || loadings.delete"
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
