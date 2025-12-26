export function startEntries() {
  let observer: any;

  const observeEvent = () => {
    const entryHandler = (list: any) => {
      const data = list.getEntries();
      for (const entry of data) {
        if (
          entry.initiatorType === 'fetch' ||
          entry.initiatorType === 'xmlhttprequest'
        ) {
          continue;
        }

        const reportData = {
          name: entry.name, // 资源的名字
          type: 'performance', // 类型
          subType: entry.entryType, // 类型
          sourceType: entry.initiatorType, // 资源类型
          duration: entry.duration, // 加载时间
          dns: entry.domainLookupEnd - entry.domainLookupStart, // dns解析时间
          tcp: entry.connectEnd - entry.connectStart, // tcp连接时间
          redirect: entry.redirectEnd - entry.redirectStart, // 重定向时间
          ttfb: entry.responseStart, // 首字节时间
          protocol: entry.nextHopProtocol, // 请求协议
          responseBodySize: entry.encodedBodySize, // 响应内容大小
          responseHeaderSize: entry.transferSize - entry.encodedBodySize, // 响应头大小
          transferSize: entry.transferSize, // 请求内容大小
          resourceSize: entry.decodedBodySize, // 资源解压后的大小
          startTime: performance.now(),
        };
        //说下resourceSize、encodedBodySize、responseBodySize的区别
        console.log(reportData);
      }
    };

    observer = new PerformanceObserver(entryHandler);
    observer.observe({ type: 'resource', buffered: true });
  };

  if (document.readyState === 'complete') {
    observeEvent();
  } else {
    const onLoad = () => {
      observeEvent();
      window.removeEventListener('load', onLoad, true);
    };
    window.addEventListener('load', onLoad, true);
  }

  return () => {
    if (observer) observer.disconnect();
  };
}
