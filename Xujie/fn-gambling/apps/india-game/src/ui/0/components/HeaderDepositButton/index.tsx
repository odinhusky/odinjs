import { memo } from 'react';
import isEqual from 'lodash/isEqual';

/**
 * 充值按鈕
 */
export const HeaderDepositButton = memo(
  ({
    onDepositClick,
    isInGame,
  }: {
    onDepositClick?: () => void;
    isInGame: boolean;
  }) => {
    return null;
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);
