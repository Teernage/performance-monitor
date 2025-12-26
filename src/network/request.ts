export function startRequest() {
  const entryHandler = (list: any) => {
    const data = list.getEntries();
    for (const entry of data) {
      // 过滤出 API 请求 (Fetch 和 XHR)
      if (
        entry.initiatorType === 'fetch' ||
        entry.initiatorType === 'xmlhttprequest'
      ) {
        const reportData = {
          name: entry.name, // 请求地址
          type: 'performance',
          subType: entry.entryType,
          sourceType: entry.initiatorType,
          duration: entry.duration, // 请求总耗时
          dns: entry.domainLookupEnd - entry.domainLookupStart, // DNS 解析耗时
          tcp: entry.connectEnd - entry.connectStart, // TCP 连接耗时
          ttfb: entry.responseStart - entry.requestStart, // 首字节响应时间 (服务端处理时间)
          transferSize: entry.transferSize, // 传输字节数
          startTime: entry.startTime, // 请求开始时间
          pageUrl: window.location.href,
        };
        console.log('Network Request:', reportData);
      }
    }
  };

  // 这里不调用 disconnect()，以便持续监听后续产生的网络请求
  const observer = new PerformanceObserver(entryHandler);
  observer.observe({ type: 'resource', buffered: true });
  return () => observer.disconnect();
}
