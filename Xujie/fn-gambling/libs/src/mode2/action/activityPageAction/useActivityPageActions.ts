import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  handleActivityUnitClick,
  handleMyBonusTabSwitchClick,
  handleSwitchTabClick,
  handleVipMyBounusClick,
  handleVipRecieveLevelRewardClick,
} from '@mode2/action/actionTypes';

import handleGlobalClick from '../handleGlobalClick';
import sdkUtils from '@mode2/utils/sdk';
import {
  ActivityUnit,
  EMyBonusTabList,
  useMode2ActivitySwitchPageStore,
  useMode2MyBonusListStore,
} from '@libs/mode2/zustand/page/activityPageStore';
import {
  usePostVIPHomeMutation,
  useVIPReceiveBoxMutation,
  useVIPReceiveMonthlyAwardMutation,
} from '@mode2API/index';

import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import handleAction from '../common/handleAction';
import { ActivityPageTabType } from '@mode2/@types/activityPageTabType';
import { useToastStore } from '@mode2/zustand/components/toastStore';
import { useMyPageStore } from '@mode2/zustand/page/myPageStore';
import useAnnouncementActionBase, {
  AnnouncementScenariosType,
} from '@mode2/usecase/announcement/useAnnouncementActionBase';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';

export enum VipRewardType {
  UPGRADE = 'upgrade',
  MONTHLY = 'monthly',
  REBATE = 'rebate',
  NONE = 'none',
}

type ActionClickPayloadMap = {
  [handleSwitchTabClick]: { idx: ActivityPageTabType };
  [handleActivityUnitClick]: {
    item: ActivityUnit;
  };
  [handleVipRecieveLevelRewardClick]: { type: VipRewardType | string };
  [handleVipMyBounusClick]: void;
  [handleMyBonusTabSwitchClick]: { value: EMyBonusTabList };
};

export interface HandleActivityPageClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useActivityPageActions = () => {
  const { t } = useTranslation();
  const { navToLoginPage, navToVipBonusPage } = useNavPageClick();

  const { onAnnouncementAction } = useAnnouncementActionBase();

  const setPageIdx = useMode2ActivitySwitchPageStore(
    (state) => state.setPageIdx
  );

  const showToast = useToastStore((state) => state.showToast);

  const [triggerVipReceiveUpgradeReward, { data: recieveUpgradeRewardResult }] =
    useVIPReceiveBoxMutation();
  const [triggerVipReceiveMonthlyReward, { data: recieveMonthlyRewardResult }] =
    useVIPReceiveMonthlyAwardMutation();
  const [postVIPHome, { data: vipHome }] = usePostVIPHomeMutation();

  const setVipTableDatas = useMyPageStore((state) => state.setVipTableDatas);
  const setVipRewardDama = useMyPageStore((state) => state.setVipRewardDama);
  const setMyBonusTabIndex = useMode2MyBonusListStore(
    (state) => state.setMyBonusTabIndex
  );

  useEffect(() => {
    if (!vipHome) return;
    setVipTableDatas(vipHome.vipInfos);
    setVipRewardDama(vipHome.rewardDamaTimes);
  }, [vipHome]);

  useEffect(() => {
    if (
      recieveUpgradeRewardResult?.isReceiveSuccess ||
      recieveMonthlyRewardResult?.isReceiveSuccess
    ) {
      showToast(t('toast_received_successfully'));
      postVIPHome();
    }
  }, [recieveUpgradeRewardResult, recieveMonthlyRewardResult]);

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleSwitchTabClick]: ({ idx }) => {
      handleGlobalClick({
        target: handleSwitchTabClick,
        payload: { idx },
        callback: () => {
          // 避免訪客模式進入 MyVipContent
          if (idx === ActivityPageTabType.VIP && !sdkUtils.isCurrentLogin()) {
            navToLoginPage(37);
            return;
          }
          setPageIdx(idx);
          window.scrollTo(0, 0);
        },
      });
    },
    [handleActivityUnitClick]: ({ item }) => {
      handleGlobalClick({
        target: handleActivityUnitClick,
        payload: { item },
        callback: () => {
          onAnnouncementAction(AnnouncementScenariosType.ACTIVITY, {
            type: item.type,
            gameObj: item.gameObj,
            linkUrl: item.linkUrl,
            mataData: item,
          });
        },
      });
    },
    [handleVipRecieveLevelRewardClick]: ({ type }) => {
      handleGlobalClick({
        target: handleVipRecieveLevelRewardClick,
        payload: { type },
        callback: () => {
          if (type === VipRewardType.UPGRADE) triggerVipReceiveUpgradeReward();
          else if (type === VipRewardType.MONTHLY)
            triggerVipReceiveMonthlyReward();
        },
      });
    },
    [handleVipMyBounusClick]: () => {
      handleGlobalClick({
        target: handleVipMyBounusClick,
        callback: () => {
          navToVipBonusPage();
        },
      });
    },
    [handleMyBonusTabSwitchClick]: ({ value }) => {
      handleGlobalClick({
        target: handleMyBonusTabSwitchClick,
        payload: { value },
        callback: () => {
          setMyBonusTabIndex(value);
        },
      });
    },
  };

  const handleActivityPageClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleActivityPageClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleActivityPageClick,
  };
};

export default useActivityPageActions;
