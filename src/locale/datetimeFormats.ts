import { DateTimeFormats as IntlDateTimeFormats } from '@intlify/core-base';

const datetimeFormats: IntlDateTimeFormats = {
  'en-US': {
    short: {
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
    },
    long: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      // second: 'numeric',
      hour12: false,
    },
  },
  'zh-CN': {
    short: {
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
    },
    long: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      // second: 'numeric',
    },
  },
};
export default datetimeFormats;
