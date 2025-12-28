
import { sendBehaviorData } from '../report';

export function startEntries(reportUrl: string) {
  let observer: any;

  const observeEvent = () => {
    const entryHandler = (list: any) => {
      const data = list.getEntries();
      for (const entry of data) {
        // 1. 过滤掉 API 请求 (由 startRequest 处理)
        if (
          entry.initiatorType === 'fetch' ||
          entry.initiatorType === 'xmlhttprequest'
        ) {
          continue;
        }

        // 2. 防止死循环：过滤掉上报接口自身的请求
        if (entry.name === reportUrl || entry.name.includes(reportUrl)) {
          continue;
        }

        // 3. 过滤掉 Beacon 请求
        if (entry.initiatorType === 'beacon') {
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
        sendBehaviorData(reportData, reportUrl);
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
