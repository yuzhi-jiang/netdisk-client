import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';

import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';

import localeMonitor from '@/views/dashboard/monitor/locale/zh-CN';

import localeSearchTable from '@/views/list/search-table/locale/zh-CN';
import localeCardList from '@/views/list/card/locale/zh-CN';

import localeDataAnalysis from '@/views/visualization/data-analysis/locale/zh-CN';
import localeMultiDAnalysis from '@/views/visualization/multi-dimension-data-analysis/locale/zh-CN';

import localeSuccess from '@/views/result/success/locale/zh-CN';
import localeError from '@/views/result/error/locale/zh-CN';

import locale403 from '@/views/exception/403/locale/zh-CN';
import locale404 from '@/views/exception/404/locale/zh-CN';
import locale500 from '@/views/exception/500/locale/zh-CN';

// import localeUserInfo from '@/views/user/info/locale/zh-CN';
import localeUserSetting from '@/views/user/setting/locale/zh-CN';

// customer
import localeFileList from '@/views/filelist/locale/zh-CN';

import localeSettings from './zh-CN/settings';
import { importAllLocale } from './utils';

export default {
  'menu.dashboard': '仪表盘',
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.workplace': '工作台-服务端',
  'menu.server.monitor': '实时监控-服务端',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '个人中心',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': '常见问题',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',

  // global
  'modal.okText': '确定',
  'modal.cancelText': '取消',
  'modal.deleteTitle': '删除警告',
  'modal.deleteContent': '是否删除？',
  'message.operationSuccess': '操作成功',
  'message.deleteSuccess': '删除成功',
  'message.deleteFail': '删除失败',
  'message.addSuccess': '添加成功',
  'message.addFail': '添加失败',
  'message.warning.noSelected': '未选择数据',
  'common.bulkDelete': '批量删除',
  'common.selected': '已选',
  'common.checkAll': '全选',
  'common.reset': '重置',
  'common.reload': '刷新',
  'common.copy': '复制',
  'common.delete': '删除',
  'common.detail': '详情',
  'common.preview': '预览',
  'common.back': '返回',
  'common.operations': '操作',
  'common.notification': '提示',

  // customer
  'menu.title': 'Netdisk',
  'menu.filelist': '我的文件',
  'menu.filelist.all': '所有文件',
  'menu.filelist.latest': '最常使用',
  'menu.filelist.collection': '我的收藏',
  'menu.filelist.share': '我的分享',
  'menu.filelist.recycle': '回收站',

  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,

  ...localeMonitor,
  ...localeSearchTable,
  ...localeCardList,
  ...localeDataAnalysis,
  ...localeMultiDAnalysis,
  ...localeSuccess,
  ...localeError,
  ...locale403,
  ...locale404,
  ...locale500,
  ...localeUserSetting,

  // customer
  ...localeFileList,
  ...importAllLocale('zh-CN'),
};
