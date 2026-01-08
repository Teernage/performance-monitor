import { sendBehaviorData } from '../report';

export function startLoad(reportUrl: string) {
  const onPageShow = (event: any) => {
    requestAnimationFrame(() => {
      ['load'].forEach((type) => {
        const reportData = {
          type: 'performance',
          subType: type,
          pageUrl: window.location.href,
          startTime: event.timeStamp,
          delay: performance.now() - event.timeStamp,
        };
        sendBehaviorData(reportData, reportUrl);
      });
    });
  };

  window.addEventListener('pageshow', onPageShow, true);

  return () => {
    window.removeEventListener('pageshow', onPageShow, true);
  };
}
