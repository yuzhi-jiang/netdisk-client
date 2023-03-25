import { createPinia } from 'pinia';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTabBarStore from './modules/tab-bar';
import useShareListStore from './modules/sharelist';

const pinia = createPinia();

export { useAppStore, useUserStore, useTabBarStore, useShareListStore };
export default pinia;
