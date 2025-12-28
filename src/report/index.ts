/**
 * 发送用户行为数据
 * @param data - 用户行为数据
 * @param url - 数据上报的URL
 */
export const sendBehaviorData = (data: Record<string, any>, url: string) => {
  // 1. 包装数据：加上一些公共信息（比如 UserAgent）
  const dataToSend = {
    ...data,
    userAgent: navigator.userAgent,
    timestamp: Date.now(),
  };

  // 2. 优先使用 sendBeacon (最稳，且不阻塞)
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(dataToSend)], {
      type: 'application/json',
    });
    navigator.sendBeacon(url, blob);
  } else {
    // 3. 降级方案：使用 fetch + keepalive
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
      keepalive: true,
    }).catch((error) => console.error('Error sending behavior data:', error));
  }
};

