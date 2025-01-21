import { useDeepEffect } from '@libs/commonUtils';
import { usePostMessageUnreadCountMutation } from '@libs/mode2/external/api';
import { useIsLoginStore } from '@libs/mode2/zustand/loginStore';
import { useMode2FeedBackPageInBoxStore } from '@libs/mode2/zustand/page/feedbackPageStore';
import { get, isEmpty } from 'lodash';
import { useEffect } from 'react';
import sdkUtils from '@mode2/utils/sdk';

export const useGetNoticeNum = () => {
  const setNoticeUnreadCount = useMode2FeedBackPageInBoxStore(
    (state) => state.setNoticeUnreadCount
  );

  const setMailUnreadCount = useMode2FeedBackPageInBoxStore(
    (state) => state.setMailUnreadCount
  );

  const isLogin = useIsLoginStore((state) => state.isLogin);

  const [
    triggerFetchUnReadCount,
    { isSuccess: isUnReadCountSuccess, data: unReadCountData },
  ] = usePostMessageUnreadCountMutation();

  useEffect(() => {
    if (isLogin) triggerFetchUnReadCount();
  }, [isLogin]);

  // 處理 UnRead Notice Count
  useDeepEffect(() => {
    if (isUnReadCountSuccess && !isEmpty(unReadCountData)) {
      // notice
      const noticeUnreadCountFromAPI = get(
        unReadCountData,
        'noticeUnreadCount',
        0
      );
      setNoticeUnreadCount(noticeUnreadCountFromAPI);
      if (noticeUnreadCountFromAPI >= 0) {
        // 同步未讀數 給 android
        sdkUtils.updateBadgeCount(noticeUnreadCountFromAPI);
      }
      // mail
      const mailUnreadCountFromAPI = get(unReadCountData, 'mailUnreadCount', 0);
      setMailUnreadCount(mailUnreadCountFromAPI);
    }
  }, [isUnReadCountSuccess, unReadCountData]);
};
export default useGetNoticeNum;
