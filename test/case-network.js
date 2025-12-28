const btnNetwork = document.getElementById('btn-network');
if (btnNetwork) {
  btnNetwork.addEventListener('click', () => {
    window.log('开始网络请求 (模拟 500ms 延迟)...');
    fetch('/api/delay/500')
      .then((res) => res.json())
      .then((data) => {
        window.log('网络请求完成', data);
      })
      .catch((err) => window.log('网络请求失败', err));
  });
}
