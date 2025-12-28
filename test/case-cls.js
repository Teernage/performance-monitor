// 4. CLS (Cumulative Layout Shift)
const btnCls = document.getElementById('btn-cls');
if (btnCls) {
  btnCls.addEventListener('click', () => {
    window.log('Triggering Layout Shift...');
    const content = document.getElementById('content-area');
    const box = document.createElement('div');
    box.className = 'box';
    box.textContent = 'CLS Block';
    box.style.display = 'flex';
    box.style.alignItems = 'center';
    box.style.justifyContent = 'center';
    box.style.color = '#fff';

    content.insertBefore(box, content.firstChild);

    setTimeout(() => {
      box.remove();
      window.log('CLS Block removed.');
    }, 1500);
  });
}

// 5. SPA Route Change Simulation
const updatePage = (path) => {
  history.pushState({}, '', path);
  const titleEl = document.getElementById('page-title');
  if (titleEl) {
    titleEl.innerText = `Current Page: ${path}`;
  }
  window.log(`路由跳转到: ${path} (模拟 SPA 切换)`);
  window.log('Check Console: CLS 应该触发上报并重置');
};

const btnRoute1 = document.getElementById('btn-route-1');
if (btnRoute1) {
  btnRoute1.addEventListener('click', () => {
    updatePage('/page1');
  });
}

const btnRoute2 = document.getElementById('btn-route-2');
if (btnRoute2) {
  btnRoute2.addEventListener('click', () => {
    updatePage('/page2');
  });
}
