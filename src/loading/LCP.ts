

import { getSelector } from '../util/index';
import { sendBehaviorData } from '../report';

export function startLCP(reportUrl: string) {
  let lcpEntry: any;
  let hasReported = false;

  const entryHandler = (list: any) => {
    for (const entry of list.getEntries()) {
      // 浏览器会不断更新 LCP，我们只需要记录最新的
      lcpEntry = entry;
    }
  };

  const observer = new PerformanceObserver(entryHandler);
  observer.observe({ type: 'largest-contentful-paint', buffered: true });

  const report = () => {
    if (hasReported || !lcpEntry) return;

    hasReported = true;
    const json = lcpEntry.toJSON();
    const reportData = {
      ...json,
      lcpTime: lcpEntry.startTime,
      elementSelector: getSelector(lcpEntry.element),
      type: 'performance',
      name: lcpEntry.name,
      pageUrl: window.location.href,
    };
    sendBehaviorData(reportData, reportUrl);

    // 上报后即可断开
    disconnect();
  };

  // 停止监听并清理
  const disconnect = () => {
    if (observer) observer.disconnect();
    ['click', 'keydown', 'pointerdown'].forEach((type) => {
      window.removeEventListener(type, report, true);
    });
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };

  // 1. 页面隐藏时上报
  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      report();
    }
  };

  // 2. 用户交互时上报（因为交互后 LCP 就不再产生/不再准确）
  ['click', 'keydown', 'pointerdown'].forEach((type) => {
    window.addEventListener(type, report, { once: true, capture: true });
  });
  document.addEventListener('visibilitychange', onVisibilityChange);

  return disconnect;
}
