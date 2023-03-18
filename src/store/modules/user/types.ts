import { type, userInfo } from 'os';

export type RoleType = '' | '*' | 'admin' | 'user';

export interface DiskItemRecord {
  capaticyName?: string;
  capaticyValue?: number;
  createTime?: string;
  createUser?: string;
  diskId?: string;
  expireTime?: string; // day
  id?: number;
  modifyTime?: string;
  modifyUser?: string;
}

export interface DiskVO {
  diskItems: DiskItemRecord[];
  id: string;
  totalCapacity: number;
  useCapacity: number;
  userId: string;
}

export interface UserVO {
  diskId: string;
  email: string;
  imgPath: string;
  mobile: string;
  token: string;
  userId: string;
  username: string;
  createTime: string;
}

export interface UserInfoRecord {
  diskVo?: Partial<DiskVO>;
  userVo?: Partial<UserVO>;
}

export interface UserBaseState {
  name?: string;
  avatar?: string;
  job?: string;
  organization?: string;
  location?: string;
  // email?: string;
  introduction?: string;
  personalWebsite?: string;
  jobName?: string;
  organizationName?: string;
  locationName?: string;
  phone?: string;
  registrationDate?: string;
  accountId?: string;
  certification?: number;
  role: RoleType;

  // netdisk
  userId?: string;
  email?: string;
  imgPath?: string;
  mobile?: string;
  token?: string;
  username?: string;
}

export type UserState = UserBaseState & UserInfoRecord;
