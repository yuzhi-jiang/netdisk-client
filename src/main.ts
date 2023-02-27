import { createApp } from 'vue';
import ArcoVue, { Modal, Message, Notification } from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import globalComponents from '@/components';
import router from './router';
import store from './store';
import i18n from './locale';
import directive from './directives';
import './mock';
import App from './App.vue';
import '@arco-design/web-vue/dist/arco.css';
import '@/assets/style/global.less';
import '@/api/interceptor';

const app = createApp(App);

app.use(ArcoVue, {});
app.use(ArcoVueIcon);

/* eslint-disable */
Modal._context = app._context;
Message._context = app._context;
Notification._context = app._context;
/* eslint-enable */

app.use(router);
app.use(store);
app.use(i18n);
app.use(globalComponents, {
  // use iconfont with symbol
  iconfont: '//at.alicdn.com/t/c/font_3852442_cchwuadrupl.js',
});
app.use(directive);

app.mount('#app');
