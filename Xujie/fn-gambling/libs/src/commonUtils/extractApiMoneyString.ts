/**
 * 提取API金錢資料字串中數字部分, 顯示格式交由前端處理避免後端回傳字串格式錯誤
 *
 * @example
 * '₹4,001.00' => 4001.00
 */
export const extractApiMoneyString = (currencyString: string): number => {
  // 移除非數字、小数點和負號的字符，同時忽略千分位逗號和貨幣符號
  const cleanedString = currencyString.replace(/[^0-9.-]+/g, '');
  const number = parseFloat(cleanedString);
  return isNaN(number) ? 0 : number;
};
