
import { onUrlChange, getSelector } from '../util';
import { sendBehaviorData } from '../report';

export function startCLS(options: any = {}) {
  const reportUrl = options.reportUrl;
  let clsValue = 0;
  let clsEntries: any[] = [];

  const entryHandler = (list: any) => {
    for (const entry of list.getEntries()) {
      if (entry.hadRecentInput) continue;

      // 简单累加 (演示用，生产环境建议用 Session Window)
      clsValue += entry.value;

      // 记录导致偏移的元素
      if (entry.sources) {
        entry.sources.forEach((source: any) => {
          if (source.node) {
            const clsEntry = {
              selector: getSelector(source.node),
              value: entry.value,
              // 可以添加更多 debug 信息，如 previousRect, currentRect
            };
            clsEntries.push(clsEntry);
            
            if (options.log) {
               console.log('[CLS] Layout Shift Detected:', clsEntry);
            }
          }
        });
      }
    }
  };

  const observer = new PerformanceObserver(entryHandler);
  observer.observe({ type: 'layout-shift', buffered: true });

  const report = (isFinal = false) => {
    const data = {
      clsValue,
      clsEntries: [...clsEntries], // 包含详细的偏移来源
      type: 'performance',
      subType: 'layout-shift',
      isFinal, // 标记是否为最终值
      pageUrl: window.location.href,
    };
    sendBehaviorData(data, reportUrl);

    // 上报后清零，为下一个路由做准备
    clsValue = 0;
    clsEntries = [];
  };

  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') report(true);
  };

  // 1. 页面关闭/隐藏时上报
  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('pagehide', () => report(true));

  // 2. 核心：SPA 路由切换时上报并重置
  onUrlChange(() => {
    // 稍微延迟一点，确保当前页面的最后一次偏移被记录
    requestAnimationFrame(() => {
      report(true);
    });
  });

  return () => {
    observer.disconnect();
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };
}
