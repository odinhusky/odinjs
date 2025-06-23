import { useDeepEffect } from '@commonUtils/hooks';
import {
  useMode2FeedBackPageActionsStore,
  useMode2FeedBackPageTabStore,
} from '@mode2/zustand/page/feedbackPageStore';
import { useFeedBackPageActions } from '@mode2/action/feedBackPageAction/useFeedBackPageActions';
import { handleFeedBackPageTabClick } from '@mode2/action/actionTypes';

export const useMode2FeedBackPageTabList = () => {
  const setTabList = useMode2FeedBackPageTabStore((state) => state.setTabList);

  const setFeedbackTabActionList = useMode2FeedBackPageActionsStore(
    (state) => state.setFeedbackTabActionList
  );

  const { handleFeedBackPageClick } = useFeedBackPageActions();

  useDeepEffect(() => {
    const tabList = [
      {
        id: 1,
        tabNameI18N: { i18nKey: 'leftnav_customer_support' },
      },
      {
        id: 2,
        tabNameI18N: { i18nKey: 'help_center_inbox_tab_inbox' },
      },
      {
        id: 3,
        tabNameI18N: { i18nKey: 'account_menu_faq' },
      },
    ];

    const feedbackActionList = tabList.map((item) => () => {
      handleFeedBackPageClick({
        actionName: handleFeedBackPageTabClick,
        payload: { tabId: item.id },
      });
    });

    setTabList(tabList);
    setFeedbackTabActionList(feedbackActionList);
  }, []);
};
export default useMode2FeedBackPageTabList;
