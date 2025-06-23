import { useDebouncedEffect } from '@libs/commonUtils';
import useReportStore from '../zustand/reportStore';
import { POST_REPORT_COLLECTION_BEHAVIOR_URL } from '../external/api/urls';
import plainAxios from '../gateway/plainAxiosInstance';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import { initData } from '../external/api/requestInitData';
import sdkUtils from '../utils/sdk';
import { REPORT_MAX_NUMBER } from '../utils/sdk/strategy/analytics/local';
import { useCallback } from 'react';
import { DEBOUNCE_INTERVAL_1000 } from '@libs/constant/debounce';

export const useLocalReport = () => {
  const reportQueue = useReportStore((state) => state.reportQueue);
  const setReportQueue = useReportStore((state) => state.setReportQueue);

  const handleReportBehaviorSubmit = useCallback(
    debounce(async () => {
      try {
        const reportQueueLength = reportQueue.length;

        if (!reportQueueLength >= REPORT_MAX_NUMBER) return;

        const cloneReportQueue = cloneDeep(reportQueue);
        const sendReportQueue = cloneReportQueue.slice(0, REPORT_MAX_NUMBER);
        const resReportQueue = cloneReportQueue.slice(REPORT_MAX_NUMBER);

        const reqData = {
          payloads: [...sendReportQueue],
        };

        const data = await initData(reqData);

        const reportBehaviorResult = await plainAxios({
          url: POST_REPORT_COLLECTION_BEHAVIOR_URL,
          method: 'POST',
          data,
        });

        // 等打完 API 成功後再清除 reportQueue
        if (reportBehaviorResult) {
          setReportQueue([...resReportQueue]);
          sdkUtils.setReportEvent(resReportQueue);
        }
      } catch (error) {
        console.error('!! handleReportBehaviorSubmit error', error);
      }
    }, DEBOUNCE_INTERVAL_1000),
    [reportQueue.length]
  );

  // 監聽 reportCount 以及 reportQueue 變動的時候，檢查超過最大比數，且停止變動超過 1s 才進行 API 發送
  // useUpdateDeepEffect(() => {
  useDebouncedEffect(
    () => {
      // console.log('!! reportQueue', reportQueue);

      if (!reportQueue || reportQueue.length < REPORT_MAX_NUMBER) {
        sdkUtils.setReportEvent(reportQueue);
        return;
      }

      handleReportBehaviorSubmit();
    },
    [reportQueue],
    DEBOUNCE_INTERVAL_1000
  );
};

export default useLocalReport;
