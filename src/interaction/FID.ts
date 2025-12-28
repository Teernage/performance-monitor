
import { getSelector } from '../util/index';
import { sendBehaviorData } from '../report';

export function startFID(reportUrl: string) {
  const entryHandler = (list: any) => {
    for (const entry of list.getEntries()) {
      observer.disconnect();
      const json = entry.toJSON();
      const inputDelay = entry.processingStart - entry.startTime;
      const reportData = {
        ...json,
        name: entry.name,
        inputDelay,
        duration: entry.duration,
        startTime: entry.startTime,
        type: 'performance',
        subType: 'first-input',
        pageUrl: window.location.href,
        elementSelector: getSelector(entry.target),
      };
      sendBehaviorData(reportData, reportUrl);
    }
  };

  const observer = new PerformanceObserver(entryHandler);
  observer.observe({ type: 'first-input', buffered: true });
  return () => observer.disconnect();
}
