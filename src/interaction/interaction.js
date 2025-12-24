export function startInteraction() {
  const supported =
    typeof PerformanceObserver !== 'undefined' &&
    PerformanceObserver.supportedEntryTypes &&
    PerformanceObserver.supportedEntryTypes.includes('event');

  if (!supported) return () => {};

  const entryHandler = (list) => {
    for (const entry of list.getEntries()) {
      // 过滤掉 duration 很短的交互，减少日志量，只关注慢交互（例如 > 40ms）
      // 或者根据需求记录所有交互
      if (entry.interactionId) {
        // interactionId 存在意味着这是一个有意义的用户交互
        const reportData = {
          type: 'performance',
          subType: 'interaction',
          name: entry.name, // e.g., 'click', 'keydown'
          duration: entry.duration, // 总耗时
          startTime: entry.startTime,
          processingStart: entry.processingStart,
          processingEnd: entry.processingEnd,
          inputDelay: entry.processingStart - entry.startTime, // 输入延迟
          processingTime: entry.processingEnd - entry.processingStart, // 事件回调执行时间
          presentationDelay:
            entry.duration - (entry.processingEnd - entry.startTime), // 渲染延迟
          interactionId: entry.interactionId,
          pageUrl: window.location.href,
        };
        console.log('Interaction:', reportData);
      }
    }
  };

  const observer = new PerformanceObserver(entryHandler);
  // durationThreshold: 16 (默认 104ms)，设置为 16ms 可以捕获更多交互细节，或者设置为 40ms 关注卡顿
  observer.observe({ type: 'event', durationThreshold: 40, buffered: true });
  return () => observer.disconnect();
}
