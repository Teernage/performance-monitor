
import { startFP, startFCP, startLCP, startLoad } from './loading';
import { startFID, startINP, startLongTask } from './interaction';
import { startCLS } from './visualStability';
import { startEntries, startRequest } from './network';

export default class PerformanceMonitor {
  options;
  constructor(options: any = {}) {
    this.options = {
      log: true, // 开发模式下开启日志
      reportUrl: '/api/performance', // 默认上报地址
      ...options,
    };
  }

  init() {
    const { reportUrl } = this.options;
    // 1. 页面加载与渲染 (Loading & Rendering)
    startFP(reportUrl);
    startFCP(reportUrl);
    startLCP(reportUrl);
    startLoad(reportUrl); // Load / Pageshow

    // 2. 交互响应 (Interaction)
    startFID(reportUrl);
    startINP(reportUrl); // INP
    startLongTask(reportUrl); // JS Long Task

    // 3. 视觉稳定性 (Visual Stability)
    startCLS(this.options); // startCLS already takes options, we'll ensure it uses reportUrl

    // 4. 资源与网络 (Resource & Network)
    startEntries(reportUrl);
    startRequest(reportUrl);

    console.log('Performance Monitor Initialized');
  }
}
