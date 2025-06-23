import { usePostPlayerEventReportMutation } from '@mode2API/index';
import { useEffect } from 'react';
import sdkUtils from '@mode2/utils/sdk';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import dayjs from '@commonUtils/localizedDayjs';

/**
 * 活躍用戶事件上報
 */
export const useActiveUserEvent = () => {
  const [postPlayerEvent, { isSuccess }] = usePostPlayerEventReportMutation();
  /**
   * 今天是否上報過
   */
  const isBeenReportToday = (): boolean => {
    const lastReportDate = Number(
      sdkUtils.getStorage(
        AppLocalStorageKey.LAST_ACTIVE_USER_EVENT_REPORT_DATE
      ) || '0'
    );
    const today = dayjs().startOf('day').unix();
    const state = lastReportDate === today;
    return state;
  };

  useEffect(() => {
    const today = dayjs().startOf('day').unix();
    if (isSuccess) {
      sdkUtils.setStorage(
        AppLocalStorageKey.LAST_ACTIVE_USER_EVENT_REPORT_DATE,
        `${today}`
      );
    }
  }, [isSuccess]);

  const doActiveEventReport = () => {
    if (sdkUtils.isCurrentLogin() && !isBeenReportToday()) {
      postPlayerEvent({ event: 'launchApp' });
    }
  };

  return {
    doActiveEventReport,
  };
};
