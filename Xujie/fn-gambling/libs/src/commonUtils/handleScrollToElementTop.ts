import isSafari from './isSafari';

export const handleScrollToElementTop = (
  ref: HTMLElement | null,
  offset: number
) => {
  const element = ref;
  const supportsSmoothScroll =
    'scrollBehavior' in document.documentElement.style;

  if (!element) return;

  if (element) {
    const safari = isSafari();
    const top =
      (element.getBoundingClientRect().top || 0) +
      (window.scrollY || 0) +
      (offset || 0);

    if (supportsSmoothScroll && !safari) {
      window.scrollTo({
        top,
        behavior: 'smooth', // 平滑滚动
      });
    } else {
      window.scrollTo(0, 0);
    }
  }
};

export default handleScrollToElementTop;
