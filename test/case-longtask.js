// 2. Long Task
const btnLongTask = document.getElementById('btn-longtask');

// 定义具名函数，方便 LoAF 归因测试
function blockMainThread100ms() {
  const start = performance.now();
  while (performance.now() - start < 100) {
    // 阻塞 100ms
  }
}

function triggerLongAnimationFrame(onDone) {
  requestAnimationFrame(function longTaskFrame() {
    blockMainThread100ms();
    if (typeof onDone === 'function') onDone();
  });
}

if (btnLongTask) {
  btnLongTask.addEventListener('click', () => {
    window.log('开始长任务（阻塞主线程 100ms）...');
    triggerLongAnimationFrame(() => {
      window.log('长任务结束');
    });
  });
}
