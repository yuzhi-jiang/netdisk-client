import Mock from 'mockjs';

import './message-box';

import '@/views/dashboard/workplace/mock';

import '@/views/dashboard/monitor/mock';
import '@/views/visualization/data-analysis/mock';
import '@/views/visualization/multi-dimension-data-analysis/mock';

// filelist
import '@/views/filelist/mock';

Mock.setup({
  timeout: '600-1000',
});
