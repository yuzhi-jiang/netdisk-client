import { createI18n } from 'vue-i18n';
import en from './en-US';
import cn from './zh-CN';
import datetimeFormats from './datetimeFormats';

export const LOCALE_OPTIONS = [
  { label: '中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' },
];
const defaultLocale = localStorage.getItem('arco-locale') || 'zh-CN';

const i18n = createI18n({
  datetimeFormats,
  locale: defaultLocale,
  fallbackLocale: 'en-US',
  allowComposition: true,
  messages: {
    'en-US': en,
    'zh-CN': cn,
  },
});

export default i18n;
