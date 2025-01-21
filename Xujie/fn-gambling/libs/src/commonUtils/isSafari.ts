/**
 * 判断当前浏览器是否为 Safari
 * @returns {boolean} 是否为 Safari
 */
export const isSafari = (): boolean => {
  const ua = navigator.userAgent;
  const vendor = navigator.vendor;

  return (
    /Safari/.test(ua) && // 检测是否包含 Safari
    !/Chrome/.test(ua) && // 排除 Chrome 浏览器
    vendor === 'Apple Computer, Inc.' // 检测供应商是否为 Apple
  );
};

export default isSafari;
