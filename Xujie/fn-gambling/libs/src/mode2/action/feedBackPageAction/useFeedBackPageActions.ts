import {
  handleFeedBackPageDesktopHeaderBackBtnClick,
  handleFeedBackPageInBoxMessageClick,
  handleFeedBackPageInBoxMessageModalCloseBtnClick,
  handleFeedBackPageInBoxMessageModalGoNowBtnClick,
  handleFeedBackPageTabClick,
} from './acitonType';

import handleGlobalClick from '../handleGlobalClick';
import {
  useMode2FeedBackPageInBoxStore,
  useMode2FeedBackPageTabStore,
} from '@libs/mode2/zustand/page/feedbackPageStore';
import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import handleAction from '../common/handleAction';
import {
  MessageActionResult,
  MessageInfoResult,
} from '@libs/mode2/external/api/endpoint/message/PostMessageListEndpoint';
import { usePostMessageReadMutation } from '@mode2API/index';
import { useEffect } from 'react';
import { cloneDeep } from 'lodash';
import {
  useNavigateClick,
  useNavPageClick,
} from '@libs/mode2/usecase/useNavPageClick';
import { KYC_BOTH_STATE, KYC_PERSONAL_STATE } from '@libs/constant/KYC';
import { feedBackPageTabIdObj } from '@mode2/@types/feedBackPageTab';
import sdkUtils from '@mode2/utils/sdk';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';

type ActionClickPayloadMap = {
  [handleFeedBackPageTabClick]: { tabId: number };
  [handleFeedBackPageDesktopHeaderBackBtnClick]: void;
  [handleFeedBackPageInBoxMessageModalCloseBtnClick]: void;
  [handleFeedBackPageInBoxMessageClick]: { data: MessageInfoResult };
  [handleFeedBackPageInBoxMessageModalGoNowBtnClick]: {
    action: MessageActionResult;
  };
};

export interface HandleFeedBackPageOnEventProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useFeedBackPageActions = () => {
  const navigate = useNavigateClick();
  const { navToLoginPage, navToWalletPage, navToBindKYCPage } =
    useNavPageClick();

  const setActiveTabId = useMode2FeedBackPageTabStore(
    (state) => state.setActiveTabId
  );

  const setIsShowMessageModal = useMode2FeedBackPageInBoxStore(
    (state) => state.setIsShowMessageModal
  );

  const setCurMessageData = useMode2FeedBackPageInBoxStore(
    (state) => state.setCurMessageData
  );

  const setInBoxPageList = useMode2FeedBackPageInBoxStore(
    (state) => state.setInBoxPageList
  );

  const setIsShowMessageModalGoNowBtn = useMode2FeedBackPageInBoxStore(
    (state) => state.setIsShowMessageModalGoNowBtn
  );

  const [postMessageRead, { isSuccess: isPostMessageReadSuccess }] =
    usePostMessageReadMutation();

  useEffect(() => {
    if (isPostMessageReadSuccess) {
      // 同步未讀數 給 android
      const badgerCount = Number(
        sdkUtils.getStorage(AppLocalStorageKey.BADGER_COUNT) || 0
      );
      sdkUtils.updateBadgeCount(badgerCount - 1);
    }
  }, [isPostMessageReadSuccess]);

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleFeedBackPageTabClick]: ({ tabId }) => {
      handleGlobalClick({
        target: handleFeedBackPageTabClick,
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
        target: handleFeedBackPageInBoxMessageModalCloseBtnClick,
        callback: () => {
          setCurMessageData(data);
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
            case 'FORWARD_RECHARGE':
            case 'FORWARD_PERSONAL_INFO':
            case 'FORWARD_BANK_CARD':
              setIsShowMessageModalGoNowBtn(true);
              break;
            default:
              setIsShowMessageModalGoNowBtn(false);
              break;
          }

          // 開啟 Modal
          setIsShowMessageModal(true);
        },
      });
    },
    [handleFeedBackPageInBoxMessageModalGoNowBtnClick]: ({ action }) => {
      // 依照 action 來判斷要做什麼事
      switch (action) {
        case 'FORWARD_RECHARGE':
          navToWalletPage();
          break;
        case 'FORWARD_PERSONAL_INFO':
          navToBindKYCPage('', { state: { tab: KYC_PERSONAL_STATE } });
          break;
        case 'FORWARD_BANK_CARD':
          navToBindKYCPage('', { state: { tab: KYC_BOTH_STATE } });
          setIsShowMessageModalGoNowBtn(false);
          break;
      }
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
