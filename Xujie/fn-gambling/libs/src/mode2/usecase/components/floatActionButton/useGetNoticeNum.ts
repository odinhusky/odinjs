import { useDeepEffect } from '@libs/commonUtils';
import {
  usePostMessageUnreadCountMutation,
  usePostMissionTipNumbersMutation,
} from '@libs/mode2/external/api';
import { useMode2FeedBackPageInBoxStore } from '@libs/mode2/zustand/page/feedbackPageStore';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { useEffect } from 'react';
import sdkUtils from '@mode2/utils/sdk';
import { useInboxMessageStore } from '@mode2/zustand/user/inboxMessageStore';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { UserRoleType } from '@mode2/@types/userRoleTypes';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';

export const useGetNoticeNum = () => {
  const setNoticeUnreadCount = useMode2FeedBackPageInBoxStore(
    (state) => state.setNoticeUnreadCount
  );

  const refreshNotifyUnreadCount = useInboxMessageStore(
    (state) => state.refreshNotifyUnreadCount
  );

  const setMailUnreadCount = useMode2FeedBackPageInBoxStore(
    (state) => state.setMailUnreadCount
  );

  const userRole = useUserProfileStore((state) => state.userRole);

  const refreshMissionTipCount = useTemplateLayoutStore(
    (state) => state.refreshMissionTipCount
  );
  const setMissionTipCount = useTemplateLayoutStore(
    (state) => state.setMissionTipCount
  );

  const [
    postMessageUnreadCount,
    { isSuccess: isUnReadCountSuccess, data: unReadCountData },
  ] = usePostMessageUnreadCountMutation();

  const [
    postMissionTipNumbers,
    { data: missionTipNumbersData, isSuccess: isMissionTipNumbersSuccess },
  ] = usePostMissionTipNumbersMutation();

  useEffect(() => {
    if ([UserRoleType.PLAYER, UserRoleType.USER].includes(userRole)) {
      useInboxMessageStore.getState().refreshNotifyUnread();
      useTemplateLayoutStore.getState().refreshMissionTip();
    }
  }, [userRole]);

  useEffect(() => {
    if (refreshNotifyUnreadCount > 0) {
      postMessageUnreadCount();
    }
  }, [refreshNotifyUnreadCount]);

  useEffect(() => {
    if (refreshMissionTipCount > 0) {
      postMissionTipNumbers();
    }
  }, [refreshMissionTipCount]);

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

  useDeepEffect(() => {
    if (isMissionTipNumbersSuccess && !isEmpty(missionTipNumbersData)) {
      const missionTipNumbersFromAPI = get(
        missionTipNumbersData,
        'totalBadge',
        0
      );
      setMissionTipCount(missionTipNumbersFromAPI);
    }
  }, [isMissionTipNumbersSuccess, missionTipNumbersData]);
};
export default useGetNoticeNum;
