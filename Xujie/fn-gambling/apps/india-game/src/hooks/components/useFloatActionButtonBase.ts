import useFloatActionButtonAction from '@mode2/action/components/floatActionButton/useFloatActionButtonAction';
import { useFloatActionButtonListStore } from '@mode2/zustand/components/floatActionButtonStore';
import { ServicesTypeResult } from '@mode2API/endpoint/user/PostHomeEndpoint';
import {
  handleFloatActionButtonActionClick,
  handleFloatActionInboxButtonActionClick,
} from '@mode2/action/actionTypes';
import { useDeepEffect } from '@commonUtils/hooks';
import { useEffect, useMemo } from 'react';
import {
  CustomerServiceScenarios,
  useCustomerServiceListStore,
} from '@mode2/zustand/components/customerServiceListStore';
import sdkUtils from '@mode2/utils/sdk';
import { useMode2FeedBackPageInBoxStore } from '@libs/mode2/zustand/page/feedbackPageStore';
import useGetNoticeNum from '@mode2/usecase/components/floatActionButton/useGetNoticeNum';

export const useFloatActionButtonBase = () => {
  // ==== 取得 Notice 的數量
  // const location = useLocation();
  const { handleFloatActionButtonClick } = useFloatActionButtonAction();
  const usageScenariosList = useCustomerServiceListStore(
    (state) => state.usageScenariosList
  );

  const noticeUnreadCount = useMode2FeedBackPageInBoxStore(
    (state) => state.noticeUnreadCount
  );

  const setFabList = useFloatActionButtonListStore((state) => state.setFabList);

  const fabConfig = useFloatActionButtonListStore((state) => state.fabConfig);

  const setShowDrawerControlBar = useFloatActionButtonListStore(
    (state) => state.setShowDrawerControlBar
  );

  const isOpen = useFloatActionButtonListStore((state) => state.isOpen);
  const setOpenDrawer = useFloatActionButtonListStore(
    (state) => state.setOpenDrawer
  );

  useEffect(() => {
    setShowDrawerControlBar(fabConfig.isDrawerStyle);
  }, [fabConfig]);

  useEffect(() => {
    if (fabConfig.isPermanentDisplay) {
      setOpenDrawer(true);
    } else {
      setOpenDrawer(isOpen);
    }
  }, [isOpen, fabConfig]);

  const fabList = useMemo(() => {
    const serviceList =
      usageScenariosList.find(
        (item) => item.scenarios === CustomerServiceScenarios.FAB
      )?.customerServiceList || [];

    const inBoxFAB = {
      label: '',
      type: 'IN_BOX',
      icon: 'icon_live_chat',
      isShowRedDot: noticeUnreadCount > 0,
      onActionClick: () => {
        handleFloatActionButtonClick({
          actionName: handleFloatActionInboxButtonActionClick,
        });
      },
    };

    const fabList = serviceList.map((item) => {
      // sdkUtils.openChat(()
      return {
        label: item.label,
        type: item.type,
        icon: item.icon,
        onActionClick: () => {
          if (item.type === ServicesTypeResult.LIVE_CHAT) {
            sdkUtils.openChat(() => {
              handleFloatActionButtonClick({
                actionName: handleFloatActionButtonActionClick,
                payload: item.payload,
              });
            });
          } else {
            handleFloatActionButtonClick({
              actionName: handleFloatActionButtonActionClick,
              payload: item.payload,
            });
          }
        },
      };
    });

    return [
      ...fabList.slice(0, 1),
      inBoxFAB, // 插入 inBoxFAB
      ...fabList.slice(1),
    ];
  }, [usageScenariosList, noticeUnreadCount]);

  useDeepEffect(() => {
    const showItems = fabList.filter((item) => {
      const filter: ServicesTypeResult | string[] = fabConfig.displayIcons;
      // showItemsFilterMapping[location.pathname] || [];
      return filter.includes(item.type);
    });

    setFabList(showItems);
  }, [fabList, fabConfig]);
};
