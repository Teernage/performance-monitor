import { getElementSelector } from '../util/index'; // 假设你有这个工具

const entryHandler = (list) => {
  for (const entry of list.getEntries()) {
    // FID 只会发生一次，所以处理完就可以断开观察器
    observer.disconnect();

    const json = entry.toJSON();

    // 计算输入延迟
    // processingStart: 浏览器开始处理事件的时间
    // startTime: 用户点击的时间
    const inputDelay = entry.processingStart - entry.startTime;

    const reportData = {
      ...json,
      name: entry.name, // 事件名，如 'mousedown', 'click', 'keydown'
      inputDelay: inputDelay,
      duration: entry.duration, // 事件处理耗时
      startTime: entry.startTime,
      type: 'performance',
      subType: 'first-input',
      pageUrl: window.location.href,
      elementSelector: getElementSelector(entry.target), // 获取交互的元素
    };

    console.log('FID:', reportData);
    // 发送数据到服务器
  }
};

const observer = new PerformanceObserver(entryHandler);

// 开启 buffered: true 很重要，因为用户可能在脚本加载完之前就已经点击了
observer.observe({ type: 'first-input', buffered: true });
