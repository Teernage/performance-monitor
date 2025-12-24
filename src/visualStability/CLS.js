export function startCLS() {
  let clsValue = 0;

  const entryHandler = (list) => {
    for (const entry of list.getEntries()) {
      if (entry.hadRecentInput) continue;
      clsValue += entry.value;
    }
  };

  const observer = new PerformanceObserver(entryHandler);
  observer.observe({ type: 'layout-shift', buffered: true });

  const finalize = () => {
    const data = {
      clsValue,
      type: 'performance',
      subType: 'layout-shift-final',
      pageUrl: window.location.href,
    };
    console.log('CLS Final:', data);
    observer.disconnect();
  };

  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') finalize();
  };

  document.addEventListener('visibilitychange', onVisibilityChange, { once: true });
  window.addEventListener('pagehide', finalize, { once: true });

  return () => {
    observer.disconnect();
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('pagehide', finalize);
  };
}