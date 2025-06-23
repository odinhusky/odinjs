import { useDeepEffect } from '@libs/commonUtils';
import { feedBackPageTabIdObj } from '@libs/mode2/@types/feedBackPageTab';
import { usePostMessageListMutation } from '@libs/mode2/external/api';
import { MessageCategoryRequest } from '@libs/mode2/external/api/endpoint/message/PostMessageListEndpoint';
import {
  useMode2FeedBackPageInBoxStore,
  useMode2FeedBackPageTabStore,
} from '@libs/mode2/zustand/page/feedbackPageStore';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { useEffect } from 'react';

export const useMode2FeedBackPageInBoxData = () => {
  const activeTabId = useMode2FeedBackPageTabStore(
    (state) => state.activeTabId
  );

  const inBoxPageNumber = useMode2FeedBackPageInBoxStore(
    (state) => state.inBoxPageNumber
  );

  const setInBoxPageList = useMode2FeedBackPageInBoxStore(
    (state) => state.setInBoxPageList
  );

  const setIsEndOfInBoxPageList = useMode2FeedBackPageInBoxStore(
    (state) => state.setIsEndOfInBoxPageList
  );

  const setInBoxPageNumber = useMode2FeedBackPageInBoxStore(
    (state) => state.setInBoxPageNumber
  );

  const setInboxLoading = useMode2FeedBackPageInBoxStore(
    (state) => state.setInboxLoading
  );

  const [
    triggerFetchMessageList,
    { isSuccess: isInBoxMsgSuccess, data: inBoxMsgData, isLoading },
  ] = usePostMessageListMutation();

  // 發送 API
  useEffect(() => {
    if (activeTabId === feedBackPageTabIdObj.INBOX) {
      triggerFetchMessageList({
        page: inBoxPageNumber,
        pageSize: 20,
        category: MessageCategoryRequest.NOTICE,
      });

      // triggerFetchUnReadCount();
    }
  }, [activeTabId, inBoxPageNumber]);

  // 處理 Message List
  useDeepEffect(() => {
    if (isInBoxMsgSuccess && !isEmpty(inBoxMsgData)) {
      const inBoxMsgList = get(inBoxMsgData, 'messages', []);

      if (inBoxMsgList.length === 0) {
        setIsEndOfInBoxPageList(true);
      }

      if (inBoxPageNumber >= 1) {
        setInBoxPageList((prev) => [
          ...cloneDeep(prev),
          ...cloneDeep(inBoxMsgList),
        ]);
      } else {
        setInBoxPageList(inBoxMsgList);
      }
    }
  }, [inBoxMsgData]);

  useEffect(() => {
    setIsEndOfInBoxPageList(false);
    setInBoxPageNumber(0);
    setInBoxPageList([]);
  }, [activeTabId]);

  useEffect(() => {
    // TODO Ronan 進入頁面會重複請求2-3次
    // setInboxLoading(isLoading);
    setInboxLoading(false);
  }, [isLoading]);

  // 處理 UnRead Notice Count
  // useDeepEffect(() => {
  //   if (isUnReadCountSuccess && !isEmpty(unReadCountData)) {
  //     // console.log('@@ isUnReadCountSuccess', isUnReadCountSuccess);
  //     // console.log('@@ unReadCountData', unReadCountData);
  //
  //     // notice
  //     const noticeUnreadCountFromAPI = get(
  //       unReadCountData,
  //       'noticeUnreadCount',
  //       0
  //     );
  //     setNoticeUnreadCount(noticeUnreadCountFromAPI);
  //
  //     // mail
  //     const mailUnreadCountFromAPI = get(unReadCountData, 'mailUnreadCount', 0);
  //     setMailUnreadCount(mailUnreadCountFromAPI);
  //   }
  // }, [isUnReadCountSuccess, unReadCountData]);
};

export default useMode2FeedBackPageInBoxData;
