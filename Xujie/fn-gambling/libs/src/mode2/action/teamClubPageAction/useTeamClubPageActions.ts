import { RefObject, useCallback, useEffect } from 'react';
import {
  useMode2TeamClubPageShareForBonusStore,
  useMode2TeamClubPageStore,
} from '@mode2/zustand/page/teamClubPageStore';
import { TeamClubPageTabType } from '@mode2/@types/teamClubPageTabType';
import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import handleAction from '../common/handleAction';
import {
  handleTeamClubPageClipboardRecommendedCodeClick,
  handleTeamClubPageClipboardRecommendedLinkClick,
  handleTeamClubPageContactNowClick,
  handleTeamClubPageInviteFriendBtnClick,
  handleTeamClubPageNavToMonthRulesPageClick,
  handleTeamClubPageNavToRulesPageClick,
  handleTeamClubPageSaveRecommendedBarCodeClick,
  handleTeamClubPageShareForBonusTabLearnMoreClick,
  handleTeamClubPageTabClick,
  handleTeamClubPageTotalInvitesClick,
  handleTeamClubPageTotalRewardsClick,
} from './actionType';
import handleGlobalClick from '../handleGlobalClick';
import {
  CustomerServiceScenarios,
  useCustomerServiceListStore,
} from '@mode2/zustand/components/customerServiceListStore';
import { ServicesTypeResult } from '@mode2API/endpoint/user/PostHomeEndpoint';
import { AdjustEventKey } from '@libs/mode2/utils/sdk/persistant/adjust/AdjustEventKey';
import { useClipboard } from '@libs/commonUtils';
import sdkUtils from '@mode2/utils/sdk';
import { useDownloadSnapshotElement } from '@commonUtils/hooks/useDownloadSnapshotElement';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import { ActivityRulesContentTypes } from '@mode2/zustand/page/activityRulesPageStore';

type ActionClickPayloadMap = {
  [handleTeamClubPageTabClick]: { tabId: TeamClubPageTabType };
  [handleTeamClubPageShareForBonusTabLearnMoreClick]: void;
  [handleTeamClubPageContactNowClick]: void;
  [handleTeamClubPageClipboardRecommendedLinkClick]: { link: string };
  [handleTeamClubPageClipboardRecommendedCodeClick]: { code: string };
  [handleTeamClubPageSaveRecommendedBarCodeClick]: {
    asImageRef: RefObject<HTMLDivElement>;
  };
  [handleTeamClubPageInviteFriendBtnClick]: void;
  [handleTeamClubPageTotalInvitesClick]: void;
  [handleTeamClubPageTotalRewardsClick]: void;
  [handleTeamClubPageNavToMonthRulesPageClick]: void;
  [handleTeamClubPageNavToRulesPageClick]: void;
};

export interface HandleInvitePageClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useTeamClubPageActions = () => {
  const {
    navToSharePage,
    navToRewardsDetailPage,
    navToSubordinateDataPage,
    navToActivityRulePage,
  } = useNavPageClick();

  const setCurTab = useMode2TeamClubPageStore((state) => state.setCurTab);
  const usageScenariosList = useCustomerServiceListStore(
    (state) => state.usageScenariosList
  );
  const setClipboardLinkResult = useMode2TeamClubPageShareForBonusStore(
    (state) => state.setClipboardLinkResult
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

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleTeamClubPageTabClick]: ({ tabId }) => {
      handleGlobalClick({
        target: handleTeamClubPageTabClick,
        callback: () => {
          setCurTab(tabId);
        },
      });
    },
    [handleTeamClubPageShareForBonusTabLearnMoreClick]: () => {
      handleGlobalClick({
        target: handleTeamClubPageShareForBonusTabLearnMoreClick,
        callback: () => {
          setCurTab(TeamClubPageTabType.MY_REWARDS);
        },
      });
    },
    [handleTeamClubPageContactNowClick]: () => {
      handleGlobalClick({
        target: handleTeamClubPageContactNowClick,
        callback: () => {
          const telegramInfo = findTelegramInfo();
          telegramInfo?.onActionClick();
        },
      });
    },
    [handleTeamClubPageClipboardRecommendedLinkClick]: ({ link }) => {
      handleGlobalClick({
        target: handleTeamClubPageClipboardRecommendedLinkClick,
        callback: () => {
          copyToClipboard(link).then((state) => {
            sdkUtils.sendEvent(AdjustEventKey.CLICK_SHARE);
            setClipboardLinkResult(state);
          });
        },
      });
    },
    [handleTeamClubPageClipboardRecommendedCodeClick]: ({ code }) => {
      handleGlobalClick({
        target: handleTeamClubPageClipboardRecommendedCodeClick,
        callback: () => {
          copyToClipboard(code).then((state) => {
            sdkUtils.sendEvent(AdjustEventKey.CLICK_SHARE);
            setClipboardLinkResult(state);
          });
        },
      });
    },
    [handleTeamClubPageSaveRecommendedBarCodeClick]: ({ asImageRef }) => {
      handleGlobalClick({
        target: handleTeamClubPageSaveRecommendedBarCodeClick,
        callback: () => {
          downloadElementAsImage(
            asImageRef,
            import.meta.env['VITE_PACKAGENAME'],
            { scale: 3 }
          );
        },
      });
    },
    [handleTeamClubPageInviteFriendBtnClick]: () => {
      handleGlobalClick({
        target: handleTeamClubPageInviteFriendBtnClick,
        callback: () => {
          navToSharePage();
          // setCurTab(TeamClubPageTabType.SHARE_FOR_BONUS);
        },
      });
    },
    [handleTeamClubPageTotalInvitesClick]: () => {
      handleGlobalClick({
        target: handleTeamClubPageTotalInvitesClick,
        callback: () => {
          navToSubordinateDataPage();
        },
      });
    },
    [handleTeamClubPageTotalRewardsClick]: () => {
      handleGlobalClick({
        target: handleTeamClubPageTotalRewardsClick,
        callback: () => {
          navToRewardsDetailPage();
        },
      });
    },
    [handleTeamClubPageNavToMonthRulesPageClick]: () => {
      handleGlobalClick({
        target: handleTeamClubPageNavToMonthRulesPageClick,
        callback: () => {
          navToActivityRulePage('', {
            state: {
              tab: ActivityRulesContentTypes.MONTH_RULES_CONTENT,
            },
          });
        },
      });
    },
    [handleTeamClubPageNavToRulesPageClick]: () => {
      handleGlobalClick({
        target: handleTeamClubPageNavToRulesPageClick,
        callback: () => {
          navToActivityRulePage('', {
            state: {
              tab: ActivityRulesContentTypes.RULES_CONTENT,
            },
          });
        },
      });
    },
  };

  const handleTeamClubPageClick = <T extends keyof ActionClickPayloadMap>({
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
    handleTeamClubPageClick,
  };
};

export default useTeamClubPageActions;
