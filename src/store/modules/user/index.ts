import { defineStore } from 'pinia';
import {
  register as userRegister,
  login as userLogin,
  logout as userLogout,
  getUserInfo,
  LoginData,
  // type LoginRes,
} from '@/api/user';
import type { LoginRes } from '@/api/user';
import { setToken, clearToken, getUserID, setUserID } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { UserState } from './types';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    name: undefined,
    avatar: undefined,
    job: undefined,
    organization: undefined,
    location: undefined,
    // email: undefined,
    introduction: undefined,
    personalWebsite: undefined,
    jobName: undefined,
    organizationName: undefined,
    locationName: undefined,
    phone: undefined,
    registrationDate: undefined,
    accountId: undefined,
    certification: undefined,
    role: '',

    userId: undefined,
    email: undefined,
    imgPath: undefined,
    mobile: undefined,
    token: undefined,
    username: undefined,

    diskVo: undefined,
    userVo: undefined,
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        this.role = this.role === 'user' ? 'admin' : 'user';
        resolve(this.role);
      });
    },
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      // 首先登录，其次获取info信息，如果刷新，则直接获取localStorage中的user_id
      const userId = getUserID();
      const { data } = await getUserInfo(userId as string);
      console.log(data);
      this.setInfo(data);
    },

    async register(loginForm: LoginData) {
      try {
        const res = await userRegister(loginForm);
        // setToken(res.data.token);
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    // Login
    async login(loginForm: LoginData) {
      try {
        const { data } = await userLogin(loginForm);
        const { token, userId } = data;
        setToken(token);
        setUserID(userId);
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    async thirdLogin(loginRes: LoginRes) {
      const { token, userId } = loginRes;
      setToken(token);
      setUserID(userId);
    },

    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    // Logout
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
});

export default useUserStore;
