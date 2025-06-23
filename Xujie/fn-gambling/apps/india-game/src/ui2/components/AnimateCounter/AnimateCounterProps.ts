import { CSSProperties } from 'react';

export interface AnimateCounterProps {
  from?: number;
  to: number;
  duration?: number; // 動畫時間 (毫秒)
  decimalPlaces?: number; // 小數點位數
  className?: string;
  trigger?: unknown; // 觸發動畫的條件
  digitClass?: string;
  digitWidthSettings?: {
    number?: number;
    dot?: number;
    comma?: number;
  };
  isFormatByDecimalPlaces?: boolean; // 是否預設用 decimalPlaces 做 step，四捨五入取到小數後第 decimalPlaces 位
  formatter?: (value: number) => string; // 自訂格式化函數
  updateInterval?: number; // 單位為毫秒

  // 如果為圖片顯示金額的話
  isImage?: boolean;
  isUserFormatterInImage?: boolean; // 是否套用 formatter function
  leadingUnitImgName?: string;
  leadingUnitImgClass?: string;
  endUnitImgName?: string;
  endUnitImgClass?: string;
  imageDigitNameFn?: (char: string | number) => string;
}
