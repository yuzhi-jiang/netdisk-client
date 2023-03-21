<script setup lang="ts">
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Form, Message } from '@arco-design/web-vue';
  import { validateFileName } from '@/utils/validate';
  import useVisible from '@/hooks/visible';
  import useLoading from '@/hooks/loading';
  import { Callback, FormSubmit } from '@/types/global';
  import { postFolder } from '@/api/filelist';

  const emits = defineEmits(['success']);

  interface IForm {
    fileName: string;
    diskId: string;
    parentFileId: string;
    type: 'folder';
  }
  const { t } = useI18n();
  const genDefaultForm = (): IForm => ({
    fileName: '',
    diskId: '',
    parentFileId: 'root',
    type: 'folder',
  });
  const { visible, setVisible } = useVisible();
  const { loading, setLoading } = useLoading();

  const formRef = ref<InstanceType<typeof Form>>();
  const form = ref<IForm>(genDefaultForm());
  const rules = {
    fileName: [
      {
        validator: (value: string, callback: Callback) => {
          if (value && validateFileName(value)) {
            return callback();
          }
          return callback(t('filelist.create.form.input.errMsg'));
        },
      },
    ],
  };

  const close = () => {
    setVisible(false);
    formRef.value?.resetFields();
  };

  const onSubmit = async ({ errors }: FormSubmit) => {
    if (errors) return;
    // network
    setLoading(true);
    try {
      //  api
      await postFolder(form.value);
      close();
      emits('success');
      Message.success(t('message.addSuccess'));
    } finally {
      setLoading(false);
    }
  };

  const init = (data?: any) => {
    setVisible(true);
    const { parentFileId, diskId } = data;
    console.log(data);
    form.value.diskId = diskId;
    form.value.parentFileId = parentFileId || form.value.parentFileId;
  };

  defineExpose({ init });
</script>

<template>
  <a-modal
    v-model:visible="visible"
    :title="$t('filelist.create.form.title')"
    :footer="false"
    :unmount-on-close="true"
    title-align="start"
  >
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      auto-label-width
      @submit="onSubmit"
    >
      <a-form-item
        field="fileName"
        :label="$t('filelist.create.form.input.label')"
        validate-trigger="input"
        :rules="{
          required: true,
          message: $t('filelist.create.form.input.errMsg'),
        }"
      >
        <a-input
          v-model="form.fileName"
          :placeholder="$t('filelist.create.form.input.placeholder')"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button html-type="submit" :loading="loading">
            {{ $t('form.actions.submit') }}
          </a-button>
          <a-button @click="close">
            {{ $t('form.actions.cancel') }}
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
