<script setup lang="ts">
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Form, Message } from '@arco-design/web-vue';
  import { validateFileName } from '@/utils/validate';
  import useVisible from '@/hooks/visible';
  import useLoading from '@/hooks/loading';
  import { Callback, FormSubmit } from '@/types/global';
  import { IPostShareNode, postShareNode } from '@/api/shares';
  import { NodeRecord } from '@/api/filelist';
  import dayjs from 'dayjs';

  const emits = defineEmits(['success']);

  const { t } = useI18n();
  const genDefaultForm = (): IPostShareNode => ({
    diskId: '',
    fileIdList: [],
    expiredTime: '',
    sharePwd: '',
    type: 2,
  });
  const { visible, setVisible } = useVisible();
  const { loading, setLoading } = useLoading();

  const formRef = ref<InstanceType<typeof Form>>();
  const form = ref<IPostShareNode>(genDefaultForm());
  const states = ref({
    disables: {
      sharePwd: false,
      expiredTime: false,
    },
  });

  const close = () => {
    setVisible(false);
    formRef.value?.resetFields();
    states.value = {
      disables: {
        sharePwd: false,
        expiredTime: false,
      },
    };
  };

  const onSubmit = async ({ errors }: FormSubmit) => {
    if (errors) return;
    // network
    setLoading(true);
    try {
      //  api
      console.log(form.value);
      await postShareNode(form.value);
      emits('success');
      close();
      Message.success('创建分享成功');
    } finally {
      setLoading(false);
    }
  };

  const init = (shareNode?: any, data?: NodeRecord[]) => {
    setVisible(true);
    setLoading(true);
    console.log(data);
    form.value = shareNode;
    setLoading(false);
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
    <a-form ref="formRef" :model="form" auto-label-width @submit="onSubmit">
      <a-form-item
        field="sharePwd"
        label="分享密码"
        :rules="{
          required: !states.disables.sharePwd,
          message: '请输入密码',
        }"
        :disabled="states.disables.sharePwd"
        validate-trigger="input"
      >
        <a-input
          v-model="form.sharePwd"
          placeholder="请输入密码"
          :max-length="6"
        ></a-input>
      </a-form-item>
      <a-form-item
        field="expiredTime"
        label="过期时间"
        :rules="{
          required: !states.disables.expiredTime,
          message: '请输入过期时间',
        }"
        :disabled="states.disables.expiredTime"
      >
        <a-date-picker
          v-model="form.expiredTime"
          :default-value="dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')"
          :disabled-date="(v: Date) => {
            if(v.getTime() < new Date().getTime()) return true
            return false
          }"
          show-time
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          position="right"
        />
      </a-form-item>
      <a-form-item field="sharePwd" label="其他选择">
        <a-space>
          <a-checkbox
            v-model="states.disables.sharePwd"
            :default-checked="false"
          >
            公开分享
          </a-checkbox>
          <a-checkbox
            v-model="states.disables.expiredTime"
            :default-checked="false"
          >
            永久有效
          </a-checkbox>
        </a-space>
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
