import localeMessageBox from '@/components/message-box/locale/en-US';
import localeLogin from '@/views/login/locale/en-US';

import localeWorkplace from '@/views/dashboard/workplace/locale/en-US';

import localeMonitor from '@/views/dashboard/monitor/locale/en-US';

import localeSearchTable from '@/views/list/search-table/locale/en-US';
import localeCardList from '@/views/list/card/locale/en-US';

import localeDataAnalysis from '@/views/visualization/data-analysis/locale/en-US';
import localeMultiDAnalysis from '@/views/visualization/multi-dimension-data-analysis/locale/en-US';

import localeSuccess from '@/views/result/success/locale/en-US';
import localeError from '@/views/result/error/locale/en-US';

import locale403 from '@/views/exception/403/locale/en-US';
import locale404 from '@/views/exception/404/locale/en-US';
import locale500 from '@/views/exception/500/locale/en-US';

// import localeUserInfo from '@/views/user/info/locale/en-US';
import localeUserSetting from '@/views/user/setting/locale/zh-CN';

// customer
import localeFileList from '@/views/filelist/locale/en-US';

import localeSettings from './en-US/settings';
import { importAllLocale } from './utils';

export default {
  'menu.dashboard': 'Dashboard',
  'menu.server.dashboard': 'Dashboard-Server',
  'menu.server.workplace': 'Workplace-Server',
  'menu.server.monitor': 'Monitor-Server',
  'menu.list': 'List',
  'menu.result': 'Result',
  'menu.exception': 'Exception',
  'menu.form': 'Form',
  'menu.profile': 'Profile',
  'menu.visualization': 'Data Visualization',
  'menu.user': 'User Center',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': 'FAQ',
  'navbar.docs': 'Docs',
  'navbar.action.locale': 'Switch to English',

  // global
  'modal.okText': 'Ok',
  'modal.cancelText': 'Cancel',
  'modal.deleteTitle': 'Delete Warning',
  'modal.deleteContent': 'Delete or not?',
  'message.operationSuccess': 'Successful operation',
  'message.deleteSuccess': 'Successfully deleted',
  'message.deleteFail': 'Delete failed!',
  'message.addSuccess': 'Added Successfully',
  'message.addFail': 'Add Failed',
  'message.warning.noSelected': 'No data is selected',
  'common.bulkDelete': 'Bulk Delete',
  'common.selected': 'Selected',
  'common.checkAll': 'Check All',
  'common.reset': 'Reset',
  'common.reload': 'Reload',
  'common.copy': 'Copy',
  'common.delete': 'Delete',
  'common.detail': 'Detail',
  'common.preview': 'Preview',
  'common.back': 'Back',
  'common.operations': 'Operations',
  'common.notification': 'Notification',

  // customer
  'menu.title': 'Netdisk',
  'menu.filelist': 'File List',
  'menu.filelist.all': 'All Files',
  'menu.filelist.latest': 'Recent Files',
  'menu.filelist.collection': 'Collections',
  'menu.filelist.share': 'File Sharing',
  'menu.filelist.recycle': 'File Recycle',

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
  ...importAllLocale('en-US'),
};
