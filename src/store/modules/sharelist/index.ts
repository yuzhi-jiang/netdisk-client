import { defineStore } from 'pinia';
import { ShareList } from './types';

export const useShareListStore = defineStore('sharelist', {
  state: (): ShareList => ({
    hasPwd: true,
    sharePwd: undefined,
    shareToken: undefined,
  }),
  actions: {
    setHasPwd(hasPwd: boolean) {
      this.hasPwd = hasPwd;
    },
    setSharePwd(pwd: string) {
      this.sharePwd = pwd;
    },
    setShareToken(token: string) {
      this.shareToken = token;
    },
    getSharePwd() {
      return this.sharePwd;
    },
  },
});

export default useShareListStore;
