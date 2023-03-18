/**
 * The guard of user login
 */
import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import { useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();

    // 不进入login，而是指定定向到指定页面
    console.log('beforeEach', to);
    if (to.name === 'register') {
      next();
      return;
    }

    if (isLogin()) {
      // isLogin, use token
      if (userStore.role) {
        next();
      } else {
        try {
          // get user info
          // 注册、登录成功后便获取信息，通过user_id
          await userStore.info();
          next();
        } catch (error) {
          await userStore.logout();
          next({
            name: 'login',
            query: {
              redirect: to.name,
              ...to.query,
            } as LocationQueryRaw,
          });
        }
      }
    } else {
      // require login，if to.name 可以防止beforeEach无限循环
      // see https://www.cnblogs.com/tugenhua0707/p/10125535.html

      if (to.name === 'login') {
        next();
        return;
      }
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      });
    }
  });
}
