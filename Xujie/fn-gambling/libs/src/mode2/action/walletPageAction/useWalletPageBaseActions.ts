import {
  handleWalletPageOpenOnlineServiceActionClick,
  handleWalletPagePayPayChannelOtpClick,
  handleWalletPageRechargeBonusSwitchClick,
  handleWalletPageRechargeCardClick,
  handleWalletPageRechargeTabCheckOrderClick,
  handleWalletPageRechargeTabCheckOrderDeatilClick,
  handleWalletPageSetPayChannelClick,
  handleWalletPageSwitchTabClick,
  handleWalletPageUseGuideActionClick,
  handleWalletPageWithdrawModifierClick,
  handleWalletPageWithdrawTabCheckOrderClick,
} from '@mode2/action/actionTypes';

import { BasePagePathObj } from '@mode2/routerTypes/types';
import {
  RecordPageBalanceRecordTabs,
  RecordPageHeaderTabs,
  RecordPageTabs,
  useRecordPageHeaderTabsStore,
} from '@libs/mode2/zustand/page/recordPageStore';
import { KYC_BOTH_STATE } from '@constant/KYC';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import handleGlobalClick from '@mode2/action/handleGlobalClick';
import handleAction from '@mode2/action/common/handleAction';
import {
  PayChannelInfoResult,
  PayOptionsResult,
} from '@mode2API/endpoint/wallet/PostPayConfigInfoWithOptionsEndpoint';
import { WalletPageTabType } from '@mode2/@types/walletPageTabType';
import { useWalletPageSwitchContentTabsStore } from '@mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';
import {
  RechargeCard,
  useWalletPageRechargeCardStore,
  useWalletRechargeHighBonusStore,
} from '@mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import useBindPlayerPhoneModalStore from '@mode2/zustand/modal/BindPlayerPhoneModal';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { UserRoleType } from '@mode2/@types/userRoleTypes';
import sdkUtils from '@mode2/utils/sdk';
import { useWalletPageStore } from '@mode2/zustand/page/WalletPage/walletPageStore';
import { WalletDashboardType } from '@mode2/@types/walletDashboardTypes';
import { hasBindPhoneModalVersionList } from '@libs/constant/versions';

type ActionClickPayloadMap = {
  [handleWalletPageSwitchTabClick]: { id: WalletPageTabType };
  [handleWalletPageRechargeCardClick]: { card: RechargeCard };
  [handleWalletPageSetPayChannelClick]: { item: PayChannelInfoResult };
  [handleWalletPagePayPayChannelOtpClick]: { item: PayOptionsResult };
  [handleWalletPageWithdrawModifierClick]: void;
  [handleWalletPageRechargeTabCheckOrderClick]: void;
  [handleWalletPageRechargeTabCheckOrderDeatilClick]: void;
  [handleWalletPageWithdrawTabCheckOrderClick]: void;
  [handleWalletPageRechargeBonusSwitchClick]: void;
  [handleWalletPageOpenOnlineServiceActionClick]: void;
  [handleWalletPageUseGuideActionClick]: void;
};

export interface HandleWalletPageBaseClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useWalletPageBaseActions = () => {
  const {
    navToLoginPage,
    mapRoutesNavTo,
    navToWalletGuidePage,
    navToOrderDetailPage,
    navToRecordPage,
  } = useNavPageClick();
  const setCurSwitchContentTabId = useWalletPageSwitchContentTabsStore(
    (state) => state.setCurSwitchContentTabId
  );

  const setCurrentRechargeCard = useWalletPageRechargeCardStore(
    (state) => state.setCurrentRechargeCard
  );

  // set 當前支付通道
  const setCurrentPayChannel = useWalletPageRechargeContentStore(
    (state) => state.setCurrentPayChannel
  );

  // 當前支付通道-支付選項
  const setCurrentPayOption = useWalletPageRechargeContentStore(
    (state) => state.setCurrentPayOption
  );

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleWalletPageSwitchTabClick]: ({ id }) => {
      handleGlobalClick({
        target: handleWalletPageSwitchTabClick,
        payload: { id },
        callback: () => {
          if (id === WalletPageTabType.WITHDRAW) {
            const userRole = useUserProfileStore.getState().userRole;
            switch (userRole) {
              case UserRoleType.GUEST:
                navToLoginPage(31);
                break;
              case UserRoleType.PLAYER:
                const vVersion = import.meta.env['VITE_V_VERSION'];
                if (hasBindPhoneModalVersionList.includes(vVersion)) {
                  useBindPlayerPhoneModalStore
                    .getState()
                    .setShowBindPlayerPhoneModal(true);
                }
                break;
              case UserRoleType.USER:
                setCurSwitchContentTabId(id);
                break;
            }
          } else {
            setCurSwitchContentTabId(id);
          }
        },
      });
    },
    [handleWalletPageRechargeCardClick]: ({ card }) => {
      handleGlobalClick({
        target: handleWalletPageRechargeCardClick,
        payload: { card },
        callback: () => {
          setCurrentRechargeCard(card);
        },
      });
    },
    [handleWalletPageSetPayChannelClick]: ({ item }) => {
      handleGlobalClick({
        target: handleWalletPageSetPayChannelClick,
        payload: { item },
        callback: () => {
          setCurrentPayChannel(item);
        },
      });
    },
    [handleWalletPagePayPayChannelOtpClick]: ({ item }) => {
      handleGlobalClick({
        target: handleWalletPagePayPayChannelOtpClick,
        payload: { item },
        callback: () => {
          setCurrentPayOption(item);
        },
      });
    },
    [handleWalletPageWithdrawModifierClick]: () => {
      handleGlobalClick({
        target: handleWalletPageWithdrawModifierClick,
        callback: () => {
          mapRoutesNavTo(BasePagePathObj.BindKYCPage, '', {
            state: { tab: KYC_BOTH_STATE },
          });
          // navigate(BasePagePathObj.BindKYCPage, {
          //   state: { tab: KYC_BOTH_STATE },
          // });
        },
      });
    },
    [handleWalletPageRechargeTabCheckOrderClick]: () => {
      handleGlobalClick({
        target: handleWalletPageRechargeTabCheckOrderClick,
        callback: () => {
          mapRoutesNavTo(BasePagePathObj.RecordPage, '', {
            state: {
              tab: RecordPageTabs.RECORD,
              subTab: RecordPageBalanceRecordTabs.ADD_CASH_RECORD,
            },
          });
        },
      });
    },
    [handleWalletPageRechargeTabCheckOrderDeatilClick]: () => {
      handleGlobalClick({
        target: handleWalletPageRechargeTabCheckOrderDeatilClick,
        callback: () => {
          switch (useWalletPageStore.getState().displayDashboardType) {
            case WalletDashboardType.BALANCE:
              useRecordPageHeaderTabsStore
                .getState()
                .setHeaderTabIndex(RecordPageHeaderTabs.DETAIL);
              navToRecordPage();
              break;
            case WalletDashboardType.NONE:
              navToOrderDetailPage();
              break;
          }
        },
      });
    },
    [handleWalletPageWithdrawTabCheckOrderClick]: () => {
      handleGlobalClick({
        target: handleWalletPageWithdrawTabCheckOrderClick,
        callback: () => {
          mapRoutesNavTo(BasePagePathObj.RecordPage, '', {
            state: {
              tab: RecordPageTabs.RECORD,
              subTab: RecordPageBalanceRecordTabs.WITHDRAWALS_RECORD,
            },
          });
        },
      });
    },
    [handleWalletPageRechargeBonusSwitchClick]: () => {
      handleGlobalClick({
        target: handleWalletPageRechargeBonusSwitchClick,
        callback: () => {
          const currentRechargeCard =
            useWalletPageRechargeCardStore.getState().currentRechargeCard;
          const highBonusCoolDownTime =
            useWalletRechargeHighBonusStore.getState().highBonusRemainTime;
          if (
            currentRechargeCard === RechargeCard.HIGH_BONUS &&
            highBonusCoolDownTime <= 0
          ) {
            useWalletRechargeHighBonusStore
              .getState()
              .setSupportHighBonus(false);
          }
          setCurrentRechargeCard(
            currentRechargeCard === RechargeCard.TOP_UP_BONUS
              ? RechargeCard.HIGH_BONUS
              : RechargeCard.TOP_UP_BONUS
          );
        },
      });
    },
    [handleWalletPageOpenOnlineServiceActionClick]: () => {
      handleGlobalClick({
        target: handleWalletPageOpenOnlineServiceActionClick,
        callback: () => {
          sdkUtils.openChat(() => {});
        },
      });
    },
    [handleWalletPageUseGuideActionClick]: () => {
      handleGlobalClick({
        target: handleWalletPageUseGuideActionClick,
        callback: () => {
          navToWalletGuidePage();
        },
      });
    },
  };

  const handleWalletPageBaseClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleWalletPageBaseClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleWalletPageBaseClick,
  };
};

export default useWalletPageBaseActions;
