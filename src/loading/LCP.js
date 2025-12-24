import { getElementSelector } from '../../util/index';

export function startLCP() {
  const entryHandler = (list) => {
    for (const entry of list.getEntries()) {
      const json = entry.toJSON();
      const reportData = {
        ...json,
        lcpTime: entry.startTime,
        elementSelector: getElementSelector(entry.element),
        type: 'performance',
        name: entry.name,
        pageUrl: window.location.href,
      };
      console.log(reportData);
    }
  };

  const observer = new PerformanceObserver(entryHandler);
  observer.observe({ type: 'largest-contentful-paint', buffered: true });
  return () => observer.disconnect();
}