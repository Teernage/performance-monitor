export const getSelector = (element: any) => {
  if (!element) return '';
  try {
    let selector = element.tagName.toLowerCase();
    if (element.id) {
      selector += `#${element.id}`;
    }
    const classAttr = element.getAttribute('class');
    if (classAttr) {
      const classes = classAttr.trim().split(/\s+/);
      if (classes.length > 0) {
        selector += `.${classes.join('.')}`;
      }
    }
    return selector;
  } catch (e) {
    return '';
  }
};

 * @param {Function} cb 回调函数
 */
export const onUrlChange = (cb: () => void) => {
  // 1. 监听浏览器前进/后退
  window.addEventListener('popstate', cb);

  // 2. 劫持 pushState (Vue/React 路由跳转常用)
  const originalPush = history.pushState;
  history.pushState = function (...args) {
    const result = originalPush.apply(this, args);
    cb();
    return result;
  };

  // 3. 劫持 replaceState
  const originalReplace = history.replaceState;
  history.replaceState = function (...args) {
    const result = originalReplace.apply(this, args);
    cb();
    return result;
  };
};
