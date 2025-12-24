import { startFP, startFCP, startLCP, startLoad } from './loading';
import {
  startFID,
  startInteraction,
  startLongTask,
} from './interaction';
import { startCLS } from './visualStability';
import { startEntries, startRequest } from './network';

export default class PerformanceMonitor {
  constructor(options = {}) {
    this.options = {
      log: true, // 开发模式下开启日志
      ...options,
    };
  }

  init() {
    // 1. 页面加载与渲染 (Loading & Rendering)
    startFP();
    startFCP();
    startLCP();
    startLoad(); // Load / Pageshow

    // 2. 交互响应 (Interaction)
    startFID();
    startInteraction(); // INP
    startLongTask(); // JS Long Task

    // 3. 视觉稳定性 (Visual Stability)
    startCLS();

    // 4. 资源与网络 (Resource & Network)
    startEntries();
    startRequest();

    console.log('Performance Monitor Initialized');
  }
}
