import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import type { ClassValue } from 'clsx';

/**
 * 合併 Tailwind 類名，解決衝突並支援條件判斷
 * @param inputs 類名陣列、物件或字串
 */
export const cx = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};
