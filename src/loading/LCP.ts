
import { getSelector } from '../util/index';
import { sendBehaviorData } from '../report';

export function startLCP(reportUrl: string) {
  const entryHandler = (list: any) => {
    for (const entry of list.getEntries()) {
      const json = entry.toJSON();
      const reportData = {
        ...json,
        lcpTime: entry.startTime,
        elementSelector: getSelector(entry.element),
        type: 'performance',
        name: entry.name,
        pageUrl: window.location.href,
      };
      sendBehaviorData(reportData, reportUrl);
    }
  };

  const observer = new PerformanceObserver(entryHandler);
  observer.observe({ type: 'largest-contentful-paint', buffered: true });
  return () => observer.disconnect();
}
