import { isEmpty } from 'lodash';

export const getFileNameAndExt = (file: string) => {
  const fileName = file.split('.').slice(0, -1).join('.');
  const fileExt = file.split('.').pop() || '';
  return { fileName, fileExt };
};

/**
 * 透過uel 取得檔案名稱
 *
 * @param url
 * @param trimExt
 * @example
 * const fileName = getFileNameByUrl("https://game.ttgroup.vip/UI_resources/banner/v1/v1_1/banner_2.png")
 * console.log(fileName)
 * >> banner_2
 *
 * @example
 * const fileName = getFileNameByUrl("https://game.ttgroup.vip/UI_resources/banner/v1/v1_1/banner_2.png", trimExt= false)
 * console.log(fileName)
 * >> banner_2.png
 */
export const getFileNameByUrl = (url: string, trimExt: boolean = true) => {
  if (isEmpty(url)) return url;
  try {
    const urlObj = new URL(url);
    const fileNameWithExt = urlObj.pathname.split('/').pop() || '';
    const { fileName, fileExt } = getFileNameAndExt(fileNameWithExt);
    return trimExt ? fileName : fileNameWithExt;
  } catch (e) {
    return url;
  }
};
