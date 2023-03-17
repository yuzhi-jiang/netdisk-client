import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

const baseURL = 'http://146.56.116.51:8082/front';
// const baseURL = 'http://192.168.196.80:8082/front';

export interface LoginData {
  account: string;
  password: string;
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
  return axios.post('');
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
  const { type } = data;
  delete data.type;

  return axios.post<LoginRes>(`${baseURL}/user/login`, data, {
    params: {
      type, // query
    },
  });
}

export function logout() {
  return axios.post<LoginRes>('/api/user/logout');
}

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

export function getOAuthLink(type: OAuthType) {
  return axios.get(`${baseURL}/oauth/login/${type}`);
}
