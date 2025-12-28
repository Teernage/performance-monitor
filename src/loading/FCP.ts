
import { sendBehaviorData } from '../report';

export function startFCP(reportUrl: string) {
  const entryHandler = (list: any) => {
    for (const entry of list.getEntries()) {
      if (
        entry.entryType === 'paint' &&
        entry.name === 'first-contentful-paint'
      ) {
        observer.disconnect();
        const json = entry.toJSON();
        const reportData = {
          ...json,
          type: 'performance',
          name: entry.name,
          pageUrl: window.location.href,
        };
        sendBehaviorData(reportData, reportUrl);
      }
    }
  };

  const observer = new PerformanceObserver(entryHandler);
  observer.observe({ type: 'paint', buffered: true });
  return () => observer.disconnect();
}
