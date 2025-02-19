import isEqual from 'lodash/isEqual';
import { memo } from 'react';

/**
 * 錢包餘額
 */
export const HeaderWalletBalanceSummary = memo(
  () => {
    return null;
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);
