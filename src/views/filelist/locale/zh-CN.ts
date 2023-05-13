import localeRecycle from '../recycle/locale/zh-CN';
import localeShare from '../shares/locale/zh-CN';

export default {
  'filelist.name': '名称',
  'filelist.tags': '文件标签',
  'filelist.updated_at': '修改日期',
  'filelist.type': '类型',
  'filelist.size': '大小',

  'folder': '文件夹',
  'file': '文件',

  'filelist.toolbar.input.placeholder': '全局搜索文件',
  'filelist.trigger.create.dir': '创建文件夹',
  'filelist.trigger.upload.file': '上传文件',
  'filelist.trigger.upload.dir': '上传文件夹',

  // modal-form
  'filelist.create.form.title': '新创建',
  'filelist.create.form.input.label': '文件夹名',
  'filelist.create.form.input.placeholder': '请输入文件夹名称',
  'filelist.create.form.input.errMsg': '请输入文件夹名称',

  'list.actions.batch-recover': '恢复',
  'list.actions.batch-delete': '删除',
  'list.actions.all-clear': '清空',
  'list.actions.create-share': '分享',
  'list.actions.create-move': '移动',
  'list.actions.create-copy': '复制',
  'list.actions.batch-download': '下载',
  'list.actions.confirm.batch-recover': '是否确认恢复？',
  'list.actions.confirm.batch-delete': '是否确认删除？',
  'list.actions.confirm.all-clear': '是否确认清空？',

  // recycle
  ...localeRecycle,
  ...localeShare,
};
