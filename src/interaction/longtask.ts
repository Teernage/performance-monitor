export function startLongTask() {
  const supported =
    typeof PerformanceObserver !== 'undefined' &&
    PerformanceObserver.supportedEntryTypes &&
    PerformanceObserver.supportedEntryTypes.indexOf('longtask') >= 0;

  if (!supported) return () => {};

  const entryHandler = (list: any) => {
    for (const entry of list.getEntries()) {
      const reportData = {
        type: 'performance',
        subType: 'longtask',
        duration: entry.duration,
        startTime: entry.startTime,
        pageUrl: window.location.href,
        // attribution 提供了长任务的归因（是哪个 iframe，哪个脚本容器等）
        attribution:
          entry.attribution && Array.isArray(entry.attribution)
            ? entry.attribution.map((a: any) => ({
                name: a.name,
                containerType: a.containerType,
                containerName: a.containerName,
                containerSrc: a.containerSrc,
              }))
            : undefined,
      };
      console.log('LongTask Monitor:', reportData);
    }
  };

  const observer = new PerformanceObserver(entryHandler);
  observer.observe({ type: 'longtask', buffered: true });
  return () => observer.disconnect();
}
