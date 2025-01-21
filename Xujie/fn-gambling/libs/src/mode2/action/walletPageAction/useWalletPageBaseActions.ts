import {
  handleWalletPagePayPayChannelOtpClick,
  handleWalletPageRechargeBonusSwitchClick,
  handleWalletPageRechargeCardClick,
  handleWalletPageRechargeTabCheckOrderClick,
  handleWalletPageSetPayChannelClick,
  handleWalletPageSwitchTabClick,
  handleWalletPageWithdrawModifierClick,
  handleWalletPageWithdrawTabCheckOrderClick,
} from './acitonType';

import { BasePagePathObj } from '@mode2/routerTypes/types';
import {
  RecordPageBalanceRecordTabs,
  RecordPageTabs,
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
import sdkUtils from '@mode2/utils/sdk';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';

type ActionClickPayloadMap = {
  [handleWalletPageSwitchTabClick]: { id: WalletPageTabType };
  [handleWalletPageRechargeCardClick]: { card: RechargeCard };
  [handleWalletPageSetPayChannelClick]: { item: PayChannelInfoResult };
  [handleWalletPagePayPayChannelOtpClick]: { item: PayOptionsResult };
  [handleWalletPageWithdrawModifierClick]: void;
  [handleWalletPageRechargeTabCheckOrderClick]: void;
  [handleWalletPageWithdrawTabCheckOrderClick]: void;
  [handleWalletPageRechargeBonusSwitchClick]: void;
};

export interface HandleWalletPageBaseClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useWalletPageBaseActions = () => {
  const { navToLoginPage, mapRoutesNavTo } = useNavPageClick();
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
        callback: () => {
          if (id === WalletPageTabType.WITHDRAW && !sdkUtils.isCurrentLogin()) {
            navToLoginPage();
          } else {
            setCurSwitchContentTabId(id);
          }
        },
      });
    },
    [handleWalletPageRechargeCardClick]: ({ card }) => {
      handleGlobalClick({
        target: handleWalletPageRechargeCardClick,
        callback: () => {
          setCurrentRechargeCard(card);
        },
      });
    },
    [handleWalletPageSetPayChannelClick]: ({ item }) => {
      handleGlobalClick({
        target: handleWalletPageSetPayChannelClick,
        callback: () => {
          setCurrentPayChannel(item);
        },
      });
    },
    [handleWalletPagePayPayChannelOtpClick]: ({ item }) => {
      handleGlobalClick({
        target: handleWalletPagePayPayChannelOtpClick,
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
