export function startLoad() {
  const onPageShow = (event: any) => {
    requestAnimationFrame(() => {
      ['load'].forEach((type) => {
        const reportData = {
          type: 'performance',
          subType: type,
          pageUrl: window.location.href,
          startTime: performance.now() - event.timeStamp,
        };
        console.log(reportData);
      });
    });
  };

  window.addEventListener('pageshow', onPageShow, true);

  return () => {
    window.removeEventListener('pageshow', onPageShow, true);
  };
}
