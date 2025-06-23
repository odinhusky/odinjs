import {
  handleInvitePageClipboardRecommendedCodeClick,
  handleInvitePageClipboardRecommendedLinkClick,
  handleInvitePageContactNowClick,
  handleInvitePageDesktopHeaderBackBtnClick,
  handleInvitePageEarnTabLeanMoreClick,
  handleInvitePageRankingListLastWeekBtnClick,
  handleInvitePageSaveRecommendedBarCodeClick,
  handleInvitePageStaticsQAClick,
  handleInvitePageStatisticsDetailCustomerServiceClick,
  handleInvitePageTabClick,
  handleInvitePageTeamDataDetailBtnClick,
} from '@mode2/action/actionTypes';
import handleGlobalClick from '../handleGlobalClick';
import {
  useMode2InviteEarnStore,
  useMode2InvitePageRankingListStore,
  useMode2InvitePageStaticsStore,
  useMode2InviteTabStore,
} from '@mode2/zustand/page/invitePageStore';

import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import handleAction from '../common/handleAction';
import { useClipboard } from '@commonUtils/hooks/useClipboard';
import { RefObject, useCallback, useEffect } from 'react';
import { useDownloadSnapshotElement } from '@commonUtils/hooks/useDownloadSnapshotElement';
import sdkUtils from '@libs/mode2/utils/sdk';
import { AdjustEventKey } from '@libs/mode2/utils/sdk/persistant/adjust/AdjustEventKey';
import { InvitePageTabType } from '@mode2/@types/invitePageTabTyp';
import {
  CustomerServiceScenarios,
  useCustomerServiceListStore,
} from '@mode2/zustand/components/customerServiceListStore';
import { ServicesTypeResult } from '@mode2API/endpoint/user/PostHomeEndpoint';
import { useNavigateClick } from '@mode2/usecase/useNavPageClick';
import { useTeamDataDetailModalStore } from '@libs/mode2/zustand/components/teamDataDetailModalStore';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { INV6 } from '@libs/constant/versions';

type ActionClickPayloadMap = {
  [handleInvitePageEarnTabLeanMoreClick]: void;
  [handleInvitePageTabClick]: { tabId: InvitePageTabType };
  [handleInvitePageStaticsQAClick]: { qaIndex: number };
  [handleInvitePageRankingListLastWeekBtnClick]: void;
  [handleInvitePageClipboardRecommendedLinkClick]: { link: string };
  [handleInvitePageClipboardRecommendedCodeClick]: { code: string };
  [handleInvitePageSaveRecommendedBarCodeClick]: {
    asImageRef: RefObject<HTMLDivElement>;
  };
  [handleInvitePageContactNowClick]: void;
  [handleInvitePageDesktopHeaderBackBtnClick]: void;
  // 其他 ActionClickType 對應的參數類型
  [handleInvitePageTeamDataDetailBtnClick]: void;
  [handleInvitePageStatisticsDetailCustomerServiceClick]: void;
};

export interface HandleInvitePageClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useInvitePageActions = () => {
  const navigate = useNavigateClick();
  const setInviteCurTab = useMode2InviteTabStore(
    (state) => state.setInviteCurTab
  );
  const setClipboardLinkResult = useMode2InviteEarnStore(
    (state) => state.setClipboardLinkResult
  );

  const usageScenariosList = useCustomerServiceListStore(
    (state) => state.usageScenariosList
  );

  const { clipboard, copyToClipboard } = useClipboard();
  const { downloadElementAsImage } =
    useDownloadSnapshotElement<HTMLDivElement>();

  useEffect(() => {
    setClipboardLinkResult(clipboard);
  }, [clipboard]);

  const findTelegramInfo = useCallback(() => {
    const inviteServiceList =
      usageScenariosList.find(
        (item) => item.scenarios === CustomerServiceScenarios.INVITE
      )?.customerServiceList || [];
    const telegramInfo = inviteServiceList.find(
      (item) => item.type === ServicesTypeResult.TELEGRAM
    );
    return telegramInfo;
  }, [usageScenariosList]);

  const setExpandedIndex = useMode2InvitePageStaticsStore(
    (state) => state.setExpandedIndex
  );

  const setShowLastData = useMode2InvitePageRankingListStore(
    (state) => state.setShowLastData
  );

  const setTeamDataDetailModalVisible = useTeamDataDetailModalStore(
    (state) => state.setTeamDataDetailModalVisible
  );

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    // TODO 依據 InvitePage 的需求新增
    [handleInvitePageTabClick]: ({ tabId }) => {
      handleGlobalClick({
        target: handleInvitePageTabClick,
        payload: { tabId },
        callback: () => {
          setInviteCurTab(tabId);
        },
      });
    },
    [handleInvitePageEarnTabLeanMoreClick]: () => {
      handleGlobalClick({
        target: handleInvitePageEarnTabLeanMoreClick,
        callback: () => {
          setInviteCurTab(InvitePageTabType.STATISTICS);
        },
      });
    },
    [handleInvitePageStaticsQAClick]: ({ qaIndex }) => {
      handleGlobalClick({
        target: handleInvitePageStaticsQAClick,
        payload: { qaIndex },
        callback: () => {
          setExpandedIndex(qaIndex);
        },
      });
    },
    [handleInvitePageRankingListLastWeekBtnClick]: () => {
      handleGlobalClick({
        target: handleInvitePageRankingListLastWeekBtnClick,
        callback: () => {
          setShowLastData(true);
        },
      });
    },
    [handleInvitePageClipboardRecommendedLinkClick]: ({ link }) => {
      handleGlobalClick({
        target: handleInvitePageClipboardRecommendedLinkClick,
        payload: { link },
        callback: () => {
          copyToClipboard(link, {
            successMessage:
              import.meta.env['VITE_V_VERSION'] === INV6
                ? 'spin_and_share_wheel_copied_toast'
                : '',
            resetInterval: 100,
          }).then((state) => {
            sdkUtils.sendEvent(AdjustEventKey.CLICK_SHARE);
            setClipboardLinkResult(state);
          });
        },
        debounceTimer: 300,
      });
    },
    [handleInvitePageClipboardRecommendedCodeClick]: ({ code }) => {
      handleGlobalClick({
        target: handleInvitePageClipboardRecommendedCodeClick,
        payload: { code },
        callback: () => {
          copyToClipboard(code).then((state) => {
            sdkUtils.sendEvent(AdjustEventKey.CLICK_SHARE);
            setClipboardLinkResult(state);
          });
        },
      });
    },
    [handleInvitePageSaveRecommendedBarCodeClick]: ({ asImageRef }) => {
      handleGlobalClick({
        target: handleInvitePageSaveRecommendedBarCodeClick,
        callback: () => {
          downloadElementAsImage(
            asImageRef,
            import.meta.env['VITE_PACKAGENAME'],
            { scale: 3 }
          );
        },
      });
    },
    [handleInvitePageContactNowClick]: () => {
      handleGlobalClick({
        target: handleInvitePageContactNowClick,
        callback: () => {
          const telegramInfo = findTelegramInfo();
          telegramInfo?.onActionClick();
        },
      });
    },
    [handleInvitePageDesktopHeaderBackBtnClick]: () => {
      handleGlobalClick({
        target: handleInvitePageDesktopHeaderBackBtnClick,
        callback: () => {
          navigate(-1);
        },
      });
    },
    [handleInvitePageTeamDataDetailBtnClick]: () => {
      handleGlobalClick({
        target: handleInvitePageTeamDataDetailBtnClick,
        callback: () => {
          setTeamDataDetailModalVisible(true);
        },
      });
    },
    [handleInvitePageStatisticsDetailCustomerServiceClick]: () => {
      handleGlobalClick({
        target: handleInvitePageStatisticsDetailCustomerServiceClick,
        callback: () => {
          navigate(BasePagePathObj.FeedBackPage);
        },
      });
    },
  };

  const handleInvitePageClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleInvitePageClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleInvitePageClick,
  };
};

export default useInvitePageActions;
