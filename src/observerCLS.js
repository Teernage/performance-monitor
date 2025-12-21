// CLS (Cumulative Layout Shift)
// 衡量视觉稳定性，计算布局偏移得分
let clsValue = 0;
let sessionValue = 0;
let sessionStart = 0;
let lastEntryTime = 0;
let sessionEntries = [];

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

document.addEventListener(
  'visibilitychange',
  () => {
    if (document.visibilityState === 'hidden') finalize();
  },
  { once: true }
);

window.addEventListener('pagehide', finalize, { once: true });
