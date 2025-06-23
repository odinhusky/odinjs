import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import isEmpty from 'lodash/isEmpty';
import { RecordStateMapping } from '@constant/RecordStateMapping';

/**
 * 對應不到狀態 直接回原始資料
 */
export const useRecordState = () => {
  const { t } = useTranslation();
  const getRecordStateValue = useCallback(
    (key: string) => {
      const i18nKey = RecordStateMapping[key.toLowerCase()];
      return !isEmpty(i18nKey) ? t(i18nKey) : key;
    },
    [t]
  );

  return {
    getRecordStateValue,
  };
};
