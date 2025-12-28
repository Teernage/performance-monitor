import { sendBehaviorData } from '../report';

export function startLongTask(reportUrl: string) {
  const types = PerformanceObserver.supportedEntryTypes || [];
  
  // 仅使用 LongTask，简单直接
  if (types.indexOf('longtask') < 0) return () => {};

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // @ts-ignore
      const attribution = entry.attribution?.map((a: any) => ({
        来源: a.name,
        类型: a.containerType
      })) || [];

      const reportData = {
        type: 'performance',
        subType: 'longtask',
        name: 'LongTask',
        duration: entry.duration,
        attribution: attribution,
        startTime: entry.startTime,
        pageUrl: window.location.href,
      };

      sendBehaviorData(reportData, reportUrl);
    }
  });

  observer.observe({ type: 'longtask', buffered: true });
  return () => observer.disconnect();
}