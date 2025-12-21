import { getElementSelector } from '../util/index';

const entryHandler = (list) => {
  // LCP 可能会随着页面加载发现更大的元素而多次触发
  for (const entry of list.getEntries()) {
    const json = entry.toJSON();

    const reportData = {
      ...json,
      // startTime 即为 LCP 时间（最大内容绘制时间）
      lcpTime: entry.startTime,
      elementSelector: getElementSelector(entry.element),
      type: 'performance',
      name: entry.name,
      pageUrl: window.location.href,
    };
    console.log(reportData);
    // 发送数据到服务器
  }
};

// 统计和计算fp的时间
const observer = new PerformanceObserver(entryHandler);
// buffered 为 true 时，会 buffered 所有 paint 事件，直到调用 observer.disconnect()
observer.observe({ type: 'largest-contentful-paint', buffered: true });
