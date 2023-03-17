<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">{{ $t('login.form.title') }}</div>
    <div class="login-form-error-msg">{{ errorMessage }}</div>

    <a-tabs v-model:active-key="state.loginType" type="line" size="medium">
      <a-tab-pane key="account" title="账号登录">
        <a-form
          ref="loginForm"
          :model="userInfo"
          class="login-form"
          layout="vertical"
          @submit="onSubmit"
        >
          <a-form-item
            hide-label
            field="username"
            :rules="[{ required: true, message: '请输入用户名' }]"
            :validate-trigger="['change', 'blur']"
          >
            <a-input v-model="userInfo.username" placeholder="请输入用户名">
              <template #prefix>
                <icon-user />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item
            field="password"
            :rules="[{ required: true, message: '请输入密码' }]"
            :validate-trigger="['change', 'blur']"
            hide-label
          >
            <a-input-password
              v-model="userInfo.password"
              placeholder="请输入密码"
              allow-clear
            >
              <template #prefix>
                <icon-lock />
              </template>
            </a-input-password>
          </a-form-item>
          <a-space :size="16" direction="vertical">
            <div class="login-form-password-actions">
              <a-checkbox
                checked="rememberPassword"
                :model-value="loginConfig.rememberPassword"
                @change="setRememberPassword as any"
              >
                {{ $t('login.form.rememberPassword') }}
              </a-checkbox>
              <a-link>{{ $t('login.form.forgetPassword') }}</a-link>
            </div>
            <a-button type="primary" html-type="submit" long :loading="loading">
              {{ $t('login.form.login') }}
            </a-button>
          </a-space>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="mobile" title="短信登录">
        <a-form
          ref="loginForm"
          :model="userInfo"
          class="login-form"
          layout="vertical"
          @submit="onSubmit"
        >
          <a-form-item
            hide-label
            field="mobile"
            :rules="[
              { required: true, message: '请输入手机号' },
              {
                validator: (v = '', cb) => {
                  if (isMobile(v.trim())) {
                    cb();
                    return;
                  }
                  cb('请输入正确的手机号码');
                },
              },
            ]"
            :validate-trigger="['change', 'blur']"
          >
            <a-input v-model="userInfo.mobile" placeholder="请输入手机号">
              <template #prefix>
                <icon-mobile />
              </template>
              <template #suffix>
                <a-tooltip mini content="默认注册账号">
                  <icon-info-circle style="cursor: pointer" />
                </a-tooltip>
              </template>
            </a-input>
          </a-form-item>
          <a-form-item
            field="captcha"
            :rules="[{ required: true, message: '请输入验证码' }]"
            :validate-trigger="['change', 'blur']"
            hide-label
          >
            <a-input
              v-model="userInfo.captcha"
              placeholder="请输入验证码"
              allow-clear
            >
              <template #prefix>
                <icon-lock />
              </template>
              <template #append>
                <a-button
                  :disabled="state.captchaTime !== 0"
                  size="mini"
                  long
                  @click="onCaptchaClick"
                >
                  {{ state.captchaTime !== 0 ? `${state.captchaTime}s` : '' }}
                  获取验证码
                </a-button>
              </template>
            </a-input>
          </a-form-item>
          <a-space :size="16" direction="vertical">
            <a-button type="primary" html-type="submit" long :loading="loading">
              {{ $t('login.form.login') }}
            </a-button>
          </a-space>
        </a-form>
      </a-tab-pane>
    </a-tabs>

    <a-divider orientation="center" :margin="32">其他方式</a-divider>

    <a-space :size="24" fill align="center">
      <a-tooltip content="微信" mini>
        <icon-wechat
          size="18"
          style="cursor: pointer"
          @click="customerLogin('wx')"
        />
      </a-tooltip>
      <a-tooltip content="QQ" mini>
        <icon-qq
          size="18"
          style="cursor: pointer"
          @click="customerLogin('qq')"
        />
      </a-tooltip>
      <a-tooltip content="Github" mini>
        <icon-github
          size="18"
          style="cursor: pointer"
          @click="customerLogin('github')"
        />
      </a-tooltip>
      <a-tooltip content="微博" mini>
        <icon-weibo
          size="18"
          style="cursor: pointer"
          @click="customerLogin('weibo')"
        />
      </a-tooltip>
      <a-button type="text" class="login-form-register-btn" @click="register">
        没有账号？点击{{ $t('login.form.register') }}
      </a-button>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useI18n } from 'vue-i18n';
  import { useStorage } from '@vueuse/core';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import type { LoginData } from '@/api/user';
  import { isMobile } from '@/utils/validate';
  import { getCaptcha, LoginType, getOAuthLink } from '@/api/user';
  import { redirectHomeOrDefault } from '@/router/utils';

  const router = useRouter();
  const { t } = useI18n();
  const errorMessage = ref('');
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();

  const loginConfig = useStorage('login-config', {
    rememberPassword: true,
    username: '', // 演示默认值
    password: '', // demo default value
  });
  const userInfo = reactive({
    username: loginConfig.value.username,
    password: loginConfig.value.password,
    mobile: '',
    captcha: '' as any,
  });
  const state = reactive<{
    captchaTime: number;
    loginType: 'account' | 'mobile';
  }>({
    captchaTime: 0,
    loginType: 'account',
  });

  const setRememberPassword = (value: boolean) => {
    loginConfig.value.rememberPassword = value;
  };

  const handleSubmit = async (values: Record<string, any>) => {
    setLoading(true);

    const remember = () => {
      const { rememberPassword } = loginConfig.value;
      const { username, password } = values;
      // 实际生产环境需要进行加密存储。
      // The actual production environment requires encrypted storage.
      loginConfig.value.username = rememberPassword ? username : '';
      loginConfig.value.password = rememberPassword ? password : '';
    };

    const { loginType } = state;

    if (loginType === 'mobile') {
      delete values.username;
      delete values.password;
      values.type = LoginType.MOBILE_CAPTCHA;
    } else if (loginType === 'account') {
      delete values.mobile;
      delete values.captcha;
      values.type = LoginType.ACCOUNT;
    }

    try {
      await userStore.login(values as LoginData);
      const { redirect, ...othersQuery } = router.currentRoute.value.query;
      router.push({
        name: (redirect as string) || 'filelist',
        query: {
          ...othersQuery,
        },
      });
      Message.success(t('login.form.login.success'));

      if (loginType === 'account') remember();
    } catch (err) {
      errorMessage.value = (err as Error).message;
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (loading.value || errors) return;
    // console.log(values);
    handleSubmit(values);
  };

  const onCaptchaClick = async () => {
    if (!isMobile(userInfo.mobile)) {
      Message.error('请输入正确的手机号');
      return;
    }

    state.captchaTime = 60;
    await getCaptcha(userInfo.mobile);
    const timer = setInterval(() => {
      state.captchaTime -= 1;
      if (state.captchaTime === 0) {
        clearInterval(timer);
      }
    }, 1000);
  };

  const customerLogin = async (type: 'wx' | 'qq' | 'github' | 'weibo') => {
    const { data: url } = await getOAuthLink(type);

    const target = window.open(url, 'Netdisk 登录页');
    // focus

    const handleOpenWindow = async (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      // {"username":"azin-cn","mobile":"","imgPath":"https://avatars.githubusercontent.com/u/97966585?v=4","token":"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjM5LCJjcmVhdGVkIjoxNjc5MDYxMTk0NjM0LCJleHAiOjE2Nzk2NjU5OTQsInVzZXJuYW1lIjoiYXppbi1jbiJ9.rLLO-P-tMILrUauxfE9QAnxhhFasJMo6HYomiaXRFAk"}
      // const { username, mobile, imgPath, token } = data;
      console.log(data);
      await userStore.setInfo({ ...data, role: '*' });
      window.removeEventListener('message', handleOpenWindow);
      // 跳转路由
      redirectHomeOrDefault();
    };
    window.addEventListener('message', handleOpenWindow);
    target?.focus();
  };

  const register = () => {
    router.push({
      name: 'register',
      // 若用户已经输入账号密码，则携带进入注册页面
      state: {
        userInfo,
      },
    });
  };
</script>

<style lang="less" scoped>
  .login-form {
    &-wrapper {
      width: 320px;
    }

    &-title {
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
    }

    &-sub-title {
      color: var(--color-text-3);
      font-size: 16px;
      line-height: 24px;
    }

    &-error-msg {
      height: 32px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    &-password-actions {
      display: flex;
      justify-content: space-between;
    }

    &-register-btn {
      color: var(--color-text-3) !important;
    }
  }
</style>
