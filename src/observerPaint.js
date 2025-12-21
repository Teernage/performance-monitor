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
      // 发送数据到服务器
    }
  }
};

// 统计和计算fp的时间
const observer = new PerformanceObserver(entryHandler);
// buffered 为 true 时，会 buffered 所有 paint 事件，直到调用 observer.disconnect()
observer.observe({ type: 'paint', buffered: true });
