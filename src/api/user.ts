import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';
import { useCloned } from '@vueuse/core';

// const baseURL = 'http://146.56.116.51:8082/front';
const baseURL = 'http://192.168.196.80:8082/front';

export interface LoginData {
  account?: string;
  password?: string;
  username?: string;
  mobile?: string;
  email?: string;
  captcha?: string;
  type?: 1 | 2 | 3 | 4;
}

export const LoginType = {
  /**
   * 账号/邮箱 密码登录
   */
  ACCOUNT: 1,
  /**
   * 手机验证码
   */
  MOBILE_CAPTCHA: 2,
  /**
   * 手机/密码
   */
  MOBILE_PASS: 3,
  /**
   * 第三方
   */
  oauth: 4,
} as const;

export function register(data: LoginData) {
  data.type = LoginType.ACCOUNT;
  return axios.post(`${baseURL}/user/register`, data);
}

export interface LoginRes {
  username: string;
  imgPath: string;
  mobile: string;
  email: string;
  token: string;
  status: 0 | 1;
}

export function login(data: LoginData) {
  // console.log('data, ', data);
  data = useCloned(data).cloned.value;
  const { type, username } = data;
  delete data.type; // 不应该影响原有的数据

  if (type === LoginType.ACCOUNT) {
    data.account = username;
    delete data.username;
  }

  return axios.post<LoginRes>(`${baseURL}/user/login`, data, {
    params: {
      type, // query
    },
  });
}

export function logout() {
  return axios.post<LoginRes>('/api/user/logout');
}

/**
 *
 * @param userid 注册、登陆时获取的user_id
 * @returns { UserState } user_info
 */
export function getUserInfo(userid: UserState['user_id'] = '') {
  return axios.get<UserState>(`${baseURL}/user/userinfo`, {
    headers: {
      user_id: userid,
    },
  });
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}

/**
 *
 * @param account 手机、邮箱
 * @param {LoginType} type  手机或者邮箱
 * @returns Promise<void>
 */
export function getCaptcha(
  account: string,
  type: 'mobile' | 'email' = 'mobile'
) {
  return axios.get(`${baseURL}/captcha/${type}`, {
    params: {
      [type]: account,
    },
  });
}

export type OAuthType = 'github' | 'wx' | 'qq' | 'weibo';

/**
 *
 * @param type 'github' | 'wx' | 'qq' | 'weibo'
 * @returns
 */
export function getOAuthLink(type: OAuthType) {
  return axios.get(`${baseURL}/oauth/login/${type}`);
}
