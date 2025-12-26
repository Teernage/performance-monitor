import { getElementSelector } from '../../util/index';

export function startFID() {
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
        elementSelector: getElementSelector(entry.target),
      };
      console.log('FID:', reportData);
    }
  };

  const observer = new PerformanceObserver(entryHandler);
  observer.observe({ type: 'first-input', buffered: true });
  return () => observer.disconnect();
}
