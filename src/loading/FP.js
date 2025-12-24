export function startFP() {
  const entryHandler = (list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'paint' && entry.name === 'first-paint') {
        observer.disconnect();
        const json = entry.toJSON();
        console.log('FP:', json);
        const reportData = {
          ...json,
          type: 'performance',
          name: entry.name,
          pageUrl: window.location.href,
        };
      }
    }
  };

  const observer = new PerformanceObserver(entryHandler);
  observer.observe({ type: 'paint', buffered: true });
  return () => observer.disconnect();
}