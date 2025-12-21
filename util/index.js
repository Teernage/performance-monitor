/**
 * 生成元素的唯一标识符（Tag + ID + Class）
 * @param element 要生成选择器的元素
 * @returns 元素的唯一选择器字符串
 */
export const getElementSelector = (element) => {
  if (!element) return '';
  try {
    let selector = element.tagName.toLowerCase();
    if (element.id) {
      selector += `#${element.id}`;
    }
    // 使用 getAttribute('class') 可以兼容 SVG 元素（SVG 的 className 是对象不是字符串）
    const className = element.getAttribute('class');
    if (className) {
      const classes = className.trim().split(/\s+/);
      if (classes.length > 0) {
        selector += `.${classes.join('.')}`;
      }
    }
    return selector;
  } catch (e) {
    return '';
  }
};
