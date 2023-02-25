import { App } from 'vue';
import { Icon } from '@arco-design/web-vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, LineChart, PieChart, RadarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GraphicComponent,
} from 'echarts/components';
import Chart from './chart/index.vue';
import Breadcrumb from './breadcrumb/index.vue';

// custom global options type

export interface IGlobalInstallOptions {
  iconfont: string;
  [p: string]: any;
}

// Manually introduce ECharts modules to reduce packing size

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GraphicComponent,
]);

// custom global components

export default {
  install(Vue: App, opts?: IGlobalInstallOptions) {
    Vue.component('Chart', Chart);
    Vue.component('Breadcrumb', Breadcrumb);
    const IconFont = Icon.addFromIconFontCn({
      src: opts?.iconfont || '',
    });
    Vue.component('IconFont', IconFont);
  },
};
