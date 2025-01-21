import sdkUtils from '@mode2/utils/sdk';

export const useElementScroll = () => {
  const scrollToTop = (targetElementId: string) => {
    const mainElement = document.getElementById(targetElementId);
    if (mainElement) {
      if (sdkUtils.isSafari()) {
        mainElement.scrollTo(0, 0);
      } else {
        mainElement.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    } else {
      if (sdkUtils.isSafari()) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    }
  };

  return {
    scrollToTop,
  };
};
