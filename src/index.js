import observeCLS from './observeCLS';
import observeFCP from './observeFCP';
import observeFID from './observeFID';
import observeLCP from './observeLCP';
import observePaint from './observePaint';
import observeEntries from './observerEntries';
import observerLoad from './observerLoad';
import observerRequest from './observerRequest';
import observerLongTask from './observerLongTask';
import observerInteraction from './observerInteraction';

export default class PerformanceMonitor {
  constructor(options = {}) {
    this.options = {
      log: true, // 开发模式下开启日志
      ...options,
    };
  }

  init() {
    // 核心 Web 指标
    observeCLS();
    observeFCP();
    observeFID();
    observeLCP();
    observePaint();

    // 资源与网络
    observeEntries(); // 静态资源
    observerRequest(); // 动态请求

    // 页面加载与体验
    observerLoad(); // Load/Pageshow
    observerLongTask(); // JS 长任务
    observerInteraction(); // 交互性能 (INP 相关)

    console.log('Performance Monitor Initialized');
  }
}
