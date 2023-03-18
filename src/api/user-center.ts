import axios from 'axios';

export interface MyProjectRecord {
  id: number;
  name: string;
  description: string;
  peopleNumber: number;
  contributors: {
    name: string;
    email: string;
    avatar: string;
  }[];
}
export function queryMyProjectList() {
  return axios.post('/api/user/my-project/list');
}

export interface MyTeamRecord {
  id: number;
  avatar: string;
  name: string;
  peopleNumber: number;
}
export function queryMyTeamList() {
  return axios.post('/api/user/my-team/list');
}

export interface LatestActivity {
  id: number;
  title: string;
  description: string;
  avatar: string;
}
export function queryLatestActivity() {
  return axios.post<LatestActivity[]>('/api/user/latest-activity');
}

export function saveUserInfo() {
  return axios.post('/api/user/save-info');
}

export interface BasicInfoModel {
  email: string;
  username: string;
  profile: string;
}

export function userUploadApi(
  data: FormData,
  config: {
    controller: AbortController;
    onUploadProgress?: (progressEvent: any) => void;
  }
) {
  // const controller = new AbortController();
  return axios.post('/api/user/upload', data, config);
}
