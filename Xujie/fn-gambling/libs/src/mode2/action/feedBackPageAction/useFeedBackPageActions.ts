import {
  handleFeedBackPageDesktopHeaderBackBtnClick,
  handleFeedBackPageInBoxMessageClick,
  handleFeedBackPageInBoxMessageDeleteBtnClick,
  handleFeedBackPageInBoxMessageDetailInnerClick,
  handleFeedBackPageInBoxMessageModalCloseBtnClick,
  handleFeedBackPageInBoxMessageModalGoNowBtnClick,
  handleFeedBackPageInBoxMessageModalToDepositBtnClick,
  handleFeedBackPageInBoxMessageReceiveBtnClick,
  handleFeedBackPageInBoxMessageReceiveSuccessModalBtnClick,
  handleFeedBackPageTabClick,
} from '@mode2/action/actionTypes';

import handleGlobalClick from '../handleGlobalClick';
import useInboxDetailPageStore, {
  useMode2FeedBackPageInBoxStore,
  useMode2FeedBackPageTabStore,
} from '@libs/mode2/zustand/page/feedbackPageStore';
import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import handleAction from '../common/handleAction';
import {
  MessageActionResult,
  MessageInfoResult,
  MessageRewardClaimStatus,
} from '@libs/mode2/external/api/endpoint/message/PostMessageListEndpoint';
import {
  usePostMessageReadMutation,
  usePostMessagesClaimMutation,
  usePostMessagesDeleteAllReadMutation,
  usePostMessagesDeleteMutation,
} from '@mode2API/index';
import { useCallback, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import {
  useNavigateClick,
  useNavPageClick,
} from '@libs/mode2/usecase/useNavPageClick';
import { KYC_BOTH_STATE, KYC_PERSONAL_STATE } from '@libs/constant/KYC';
import { feedBackPageTabIdObj } from '@mode2/@types/feedBackPageTab';
import sdkUtils from '@mode2/utils/sdk';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import { WalletPageTabType } from '@mode2/@types/walletPageTabType';
import { WalletDashboardType } from '@mode2/@types/walletDashboardTypes';
import { useWalletPageStore } from '@mode2/zustand/page/WalletPage/walletPageStore';
import { useWalletPageSwitchContentTabsStore } from '@mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';
import { useMessageStore } from '@libs/mode2/zustand/components/messageStore';
import { InBoxDetailInnerActionTypes } from '@mode2/@types/inBoxDetailInnerActionTypes';
import { ServicesTypeResult } from '@mode2API/endpoint/user/PostHomeEndpoint';
import { usePlatformServicesStore } from '@mode2/zustand/platform/platformServicesStore';

export type ActionClickPayloadMap = {
  [handleFeedBackPageTabClick]: { tabId: number };
  [handleFeedBackPageDesktopHeaderBackBtnClick]: void;
  [handleFeedBackPageInBoxMessageModalCloseBtnClick]: void;
  [handleFeedBackPageInBoxMessageClick]: { data: MessageInfoResult };
  [handleFeedBackPageInBoxMessageModalGoNowBtnClick]: {
    action: MessageActionResult;
  };
  [handleFeedBackPageInBoxMessageDeleteBtnClick]: { ids: number[] };
  [handleFeedBackPageInBoxMessageReceiveBtnClick]: {
    ids: number[];
    totalReward: number;
  };
  [handleFeedBackPageInBoxMessageModalToDepositBtnClick]: void;
  [handleFeedBackPageInBoxMessageReceiveSuccessModalBtnClick]: void;
  [handleFeedBackPageInBoxMessageDetailInnerClick]: {
    action: InBoxDetailInnerActionTypes;
  };
};

export interface HandleFeedBackPageOnEventProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useFeedBackPageActions = () => {
  const navigate = useNavigateClick();
  const {
    navToLoginPage,
    navToWalletPage,
    navToBindKYCPage,
    navToInviteWheelPage,
    navToInboxDetailPage,
    navToRechargeSecretPage,
  } = useNavPageClick();

  const setDisplayDashboardType = useWalletPageStore(
    (state) => state.setDisplayDashboardType
  );
  const setCurSwitchContentTabId = useWalletPageSwitchContentTabsStore(
    (state) => state.setCurSwitchContentTabId
  );

  const setActiveTabId = useMode2FeedBackPageTabStore(
    (state) => state.setActiveTabId
  );

  const setIsShowMessageModal = useMode2FeedBackPageInBoxStore(
    (state) => state.setIsShowMessageModal
  );

  const curMessageData = useMode2FeedBackPageInBoxStore(
    (state) => state.curMessageData
  );
  const isShowMessageModal = useMode2FeedBackPageInBoxStore(
    (state) => state.isShowMessageModal
  );
  const setCurMessageData = useMode2FeedBackPageInBoxStore(
    (state) => state.setCurMessageData
  );
  const setInboxDetail = useInboxDetailPageStore(
    (state) => state.setInboxDetail
  );

  const setInBoxPageList = useMode2FeedBackPageInBoxStore(
    (state) => state.setInBoxPageList
  );

  const setIsShowMessageModalGoNowBtn = useMode2FeedBackPageInBoxStore(
    (state) => state.setIsShowMessageModalGoNowBtn
  );

  const setIsShowReceiveModal = useMode2FeedBackPageInBoxStore(
    (state) => state.setIsShowReceiveModal
  );

  const setTotalReward = useMode2FeedBackPageInBoxStore(
    (state) => state.setTotalReward
  );

  const [postMessageRead, { isSuccess: isPostMessageReadSuccess }] =
    usePostMessageReadMutation();

  const [postMessagesDelete, { isSuccess: isPostMessagesDeleteSuccess }] =
    usePostMessagesDeleteMutation();

  const [
    postMessagesDeleteAllRead,
    { isSuccess: isPostMessagesDeleteAllReadSuccess },
  ] = usePostMessagesDeleteAllReadMutation();

  const [postMessagesClaim, { isSuccess: isPostMessagesClaimSuccess }] =
    usePostMessagesClaimMutation();

  const servicesList = usePlatformServicesStore((state) => state.servicesList);
  const findLink = useCallback(
    (type: ServicesTypeResult, def: string): string => {
      const link = servicesList.find((item) => item.type === type)?.link;
      return link || def;
    },
    [servicesList]
  );

  // 领取或者删除成功之后手动更新当前列表数据中的 isClaim status read 状态
  const updateInboxList = (type: 'delete' | 'receive', isAll: boolean) => {
    const id = curMessageData.id;
    if (type === 'delete') {
      setInBoxPageList((prev) =>
        isAll
          ? prev.filter((item) => !item.isRead)
          : prev.filter((item) => item.id !== id)
      );
    } else {
      setInBoxPageList((prev) =>
        prev.map((item) =>
          isAll || item.id === id
            ? {
                ...item,
                isClaim: 1,
                status: MessageRewardClaimStatus.CLAIMED,
                // isRead: isAll ? item.isRead : true,
              }
            : item
        )
      );
    }
  };

  useEffect(() => {
    if (isPostMessageReadSuccess) {
      // 同步未讀數 給 android
      const badgerCount = Number(
        sdkUtils.getStorage(AppLocalStorageKey.BADGER_COUNT) || 0
      );
      sdkUtils.updateBadgeCount(badgerCount - 1);
    }
  }, [isPostMessageReadSuccess]);

  useEffect(() => {
    if (isPostMessagesDeleteSuccess) {
      setIsShowMessageModal(false);
      if (import.meta.env['VITE_V_VERSION'] === 'v6') {
        navigate(-1);
      }
      // 关闭modal之后不再打api，手动更新列表数据状态
      updateInboxList('delete', false);
    }
  }, [isPostMessagesDeleteSuccess]);

  useEffect(() => {
    if (isPostMessagesDeleteAllReadSuccess) {
      setIsShowMessageModal(false);
      // 关闭modal之后不再打api，手动更新列表数据状态
      updateInboxList('delete', true);
    }
  }, [isPostMessagesDeleteAllReadSuccess]);

  useEffect(() => {
    if (isPostMessagesClaimSuccess) {
      console.log('claim success');
      setIsShowReceiveModal(true);
      setCurMessageData({
        ...curMessageData,
        isClaim: 1,
        status: MessageRewardClaimStatus.CLAIMED,
      });
      setInboxDetail({
        ...curMessageData,
        isClaim: 1,
        status: MessageRewardClaimStatus.CLAIMED,
      });

      // 关闭modal之后不再打api，手动更新列表数据状态
      updateInboxList('receive', isShowMessageModal ? false : true);
    }
  }, [isPostMessagesClaimSuccess]);

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleFeedBackPageTabClick]: ({ tabId }) => {
      handleGlobalClick({
        target: handleFeedBackPageTabClick,
        payload: { tabId },
        callback: () => {
          if (
            tabId === feedBackPageTabIdObj.INBOX &&
            !sdkUtils.isCurrentLogin()
          ) {
            navToLoginPage(32);
          } else {
            setActiveTabId(tabId);
          }
        },
      });
    },
    [handleFeedBackPageDesktopHeaderBackBtnClick]: () => {
      handleGlobalClick({
        target: handleFeedBackPageDesktopHeaderBackBtnClick,
        callback: () => {
          navigate(-1);
        },
      });
    },
    [handleFeedBackPageInBoxMessageModalCloseBtnClick]: () => {
      handleGlobalClick({
        target: handleFeedBackPageInBoxMessageModalCloseBtnClick,
        callback: () => {
          setIsShowMessageModal(false);
        },
      });
    },
    [handleFeedBackPageInBoxMessageClick]: ({ data }) => {
      handleGlobalClick({
        target: handleFeedBackPageInBoxMessageClick,
        payload: { data },
        callback: () => {
          setCurMessageData(data);
          setInboxDetail(data);
          if (!data.isRead) {
            postMessageRead({ idList: [data.id] });
          }
          // 把現有資料中符合的資料手動改成 isRead = true 少打一次 API
          setInBoxPageList((prev) => {
            const resultList = prev.map((item) => {
              const cloneItem = cloneDeep(item);

              if (item.id === data.id) {
                cloneItem.isRead = true;
              }

              return cloneItem;
            });

            return resultList;
          });

          // 依照 action 來判斷要不要顯示 Go Now 按鈕
          switch (data.action) {
            case MessageActionResult.FORWARD_RECHARGE:
            case MessageActionResult.FORWARD_PERSONAL_INFO:
            case MessageActionResult.FORWARD_BANK_CARD:
            case MessageActionResult.FORWARD_SHARE_SPIN:
            case MessageActionResult.FORWARD_INBOX_RECHARGE:
              setIsShowMessageModalGoNowBtn(true);
              break;
            default:
              setIsShowMessageModalGoNowBtn(false);
              break;
          }

          if (import.meta.env['VITE_V_VERSION'] === 'v6') {
            // v6是頁面，其他版本是Modal
            navToInboxDetailPage();
          } else {
            // 開啟 Modal
            setIsShowMessageModal(true);
          }
        },
      });
    },
    [handleFeedBackPageInBoxMessageModalGoNowBtnClick]: ({ action }) => {
      // 依照 action 來判斷要做什麼事
      switch (action) {
        case MessageActionResult.FORWARD_RECHARGE:
          useWalletPageStore
            .getState()
            .setDisplayDashboardType(WalletDashboardType.NONE);
          useWalletPageSwitchContentTabsStore
            .getState()
            .setCurSwitchContentTabId(WalletPageTabType.DEPOSIT);
          navToWalletPage('', { state: { tab: WalletPageTabType.DEPOSIT } });
          break;
        case MessageActionResult.FORWARD_PERSONAL_INFO:
          navToBindKYCPage('', { state: { tab: KYC_PERSONAL_STATE } });
          break;
        case MessageActionResult.FORWARD_BANK_CARD:
          navToBindKYCPage('', { state: { tab: KYC_BOTH_STATE } });
          setIsShowMessageModalGoNowBtn(false);
          break;
        case MessageActionResult.FORWARD_SHARE_SPIN:
          navToInviteWheelPage();
          break;
        case MessageActionResult.FORWARD_INBOX_RECHARGE:
          navToRechargeSecretPage();
          break;
      }
    },

    // FOR V6
    [handleFeedBackPageInBoxMessageModalToDepositBtnClick]: () => {
      handleGlobalClick({
        target: handleFeedBackPageInBoxMessageModalToDepositBtnClick,
        callback: () => {
          setDisplayDashboardType(WalletDashboardType.NONE);
          setCurSwitchContentTabId(WalletPageTabType.DEPOSIT);
          navToWalletPage('', { state: { tab: WalletPageTabType.DEPOSIT } });
        },
      });
    },
    [handleFeedBackPageInBoxMessageDeleteBtnClick]: ({ ids }) => {
      handleGlobalClick({
        target: handleFeedBackPageInBoxMessageDeleteBtnClick,
        payload: { ids },
        callback: () => {
          if (ids.length === 1) {
            postMessagesDelete({ ids });
          } else {
            postMessagesDeleteAllRead();
          }
        },
      });
    },
    [handleFeedBackPageInBoxMessageReceiveBtnClick]: ({ ids, totalReward }) => {
      handleGlobalClick({
        target: handleFeedBackPageInBoxMessageReceiveBtnClick,
        payload: { ids, totalReward },
        callback: () => {
          if (ids.length === 0) {
            // TODO i18n
            useMessageStore
              .getState()
              .info('Please recharge to unlock the paid bonus rewards.');
            return;
          }
          postMessagesClaim({ ids });
          setTotalReward(totalReward);
        },
      });
    },
    [handleFeedBackPageInBoxMessageReceiveSuccessModalBtnClick]: () => {
      handleGlobalClick({
        target: handleFeedBackPageInBoxMessageReceiveSuccessModalBtnClick,
        callback: () => {
          setIsShowReceiveModal(false);
        },
      });
    },
    [handleFeedBackPageInBoxMessageDetailInnerClick]: ({ action }) => {
      handleGlobalClick({
        target: handleFeedBackPageInBoxMessageDetailInnerClick,
        payload: { action },
        callback: () => {
          switch (action) {
            case InBoxDetailInnerActionTypes.WHATS_APP_LINK:
              {
                {
                  const targetUrl = findLink(ServicesTypeResult.WHATS_APP, '');
                  if (targetUrl) {
                    sdkUtils.openBrowser(targetUrl);
                  }
                }
              }
              break;
            case InBoxDetailInnerActionTypes.TG_LINK:
              {
                const targetUrl = findLink(ServicesTypeResult.TELEGRAM, '');
                if (targetUrl) {
                  sdkUtils.openBrowser(targetUrl);
                }
              }
              break;
            case InBoxDetailInnerActionTypes.SERVICE_LINK:
              sdkUtils.openChat(() => {});
              break;
            case InBoxDetailInnerActionTypes.OPERATIONS_TEAM_LINK:
              {
                const targetUrl = findLink(ServicesTypeResult.TELEGRAM, '');
                if (targetUrl) {
                  sdkUtils.openBrowser(targetUrl);
                }
              }
              break;
          }
        },
      });
    },
  };

  const handleFeedBackPageClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleFeedBackPageOnEventProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleFeedBackPageClick,
  };
};

export default useFeedBackPageActions;
