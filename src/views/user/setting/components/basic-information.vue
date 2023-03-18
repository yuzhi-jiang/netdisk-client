<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 8 }"
    :wrapper-col-props="{ span: 16 }"
  >
    <a-form-item
      field="email"
      :label="$t('userSetting.basicInfo.form.label.email')"
      :rules="[
        {
          required: true,
          message: $t('userSetting.form.error.email.required'),
        },
      ]"
    >
      <a-input v-model="formData.email" placeholder="请输入邮箱地址" />
    </a-form-item>
    <a-form-item
      field="username"
      label="用户名"
      :rules="[
        {
          required: true,
          message: '请输入用户名',
        },
      ]"
    >
      <a-input v-model="formData.username" placeholder="请输入用户名" />
    </a-form-item>
    <a-form-item
      field="profile"
      :label="$t('userSetting.basicInfo.form.label.profile')"
      :rules="[
        {
          maxLength: 200,
          message: $t('userSetting.form.error.profile.maxLength'),
        },
      ]"
      row-class="keep-margin"
    >
      <a-textarea
        v-model="formData.profile"
        :placeholder="$t('userSetting.basicInfo.placeholder.profile')"
      />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button type="primary" @click="validate">
          {{ $t('userSetting.save') }}
        </a-button>
        <a-button type="secondary" @click="reset"> 恢复 </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { BasicInfoModel } from '@/api/user-center';
  import { useUserStore } from '@/store';

  const { userVo } = useUserStore();

  const formRef = ref<FormInstance>();
  const formData = ref<Partial<BasicInfoModel>>({
    email: userVo?.email,
    username: userVo?.username,
    profile: userVo?.username,
  });
  const validate = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      // do some thing
      // you also can use html-type to submit
    }
  };
  const reset = async () => {
    formData.value = {
      email: userVo?.email,
      username: userVo?.username,
      profile: userVo?.username,
    };
  };
</script>

<style scoped lang="less">
  .form {
    width: 540px;
    margin: 0 auto;
  }
</style>
