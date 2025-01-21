/**
 * 判斷字串中是否包含指定的 Tailwind CSS 文字大小類別。
 * @param {string} inputString - 要檢查的字串。
 * @returns {boolean} - 如果包含指定類別，回傳 true；否則回傳 false。
 */
export const isTailwindTextClass = (inputString: string) => {
  // 定義正則表達式匹配所有可能的文字大小類別
  const regex =
    /(?:^|\s)(?:(?:mobile:|tablet:|desktop:|sm:|md:|lg:|xl:|2xl:)?text-(?:xxs|xs|sm|base|lg|xl|xxl|[3-9]xl|\[\d+(?:px|rem|em)\]))(\s|$)/;

  // 測試字串是否包含匹配類別
  return regex.test(inputString);
};

export default isTailwindTextClass;
