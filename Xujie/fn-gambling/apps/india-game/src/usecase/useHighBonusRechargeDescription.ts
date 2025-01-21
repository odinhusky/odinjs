import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';
import { formatMoney } from '@mode2/utils';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { useMemo } from 'react';
import {
  RechargeCard,
  useWalletPageRechargeCardStore,
} from '@mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';

export interface RechargeDescriptionItem {
  i18nKey: string;
  useI18nOption?: boolean;
  className?: string;
}

export const useHighBonusRechargeDescription = () => {
  const isFirstDeposit = useUserProfileStore((state) => state.isFirstDeposit);

  const currentRechargeCard = useWalletPageRechargeCardStore(
    (state) => state.currentRechargeCard
  );

  const currentPayChannel = useWalletPageRechargeContentStore(
    (state) => state.currentPayChannel
  );

  const currentOptCashBackRate = useWalletPageRechargeContentStore(
    (state) => state.currentOptCashBackRate
  );
  const currentOptAmount = useWalletPageRechargeContentStore(
    (state) => state.currentOptAmount
  );

  const currentOptRebateAmount = useWalletPageRechargeContentStore(
    (state) => state.currentOptRebateAmount
  );

  const firstDepositDescriptionList: RechargeDescriptionItem[] = [
    {
      i18nKey: 'wallet_first_deposit_with_bonus_reminder_content_1',
    },
    {
      i18nKey: 'wallet_first_deposit_with_bonus_reminder_content_2',
      useI18nOption: true,
    },
    {
      i18nKey: 'wallet_first_deposit_with_bonus_reminder_content_3',
    },
    {
      i18nKey: 'wallet_first_deposit_with_bonus_reminder_content_4',
      className: '',
    },
  ];

  // 首充 高级奖励
  const firstDepositHighBonusDescriptionList: RechargeDescriptionItem[] = [
    {
      i18nKey: 'wallet_first_deposit_premium_bonus_reminder_content_1',
    },
    {
      i18nKey: 'wallet_first_deposit_premium_bonus_reminder_content_2',
    },
    {
      i18nKey: 'wallet_first_deposit_premium_bonus_reminder_content_3',
      useI18nOption: true,
    },
    {
      i18nKey: 'wallet_first_deposit_premium_bonus_reminder_content_4',
    },
    {
      i18nKey: 'wallet_first_deposit_premium_bonus_reminder_content_5',
      className: '',
    },
  ];

  // 复充 一般奖励
  const depositDescriptionList: RechargeDescriptionItem[] = [
    {
      i18nKey: 'wallet_recharge_with_bonus_reminder_content_1',
    },
    {
      i18nKey: 'wallet_recharge_with_bonus_reminder_content_2',
      useI18nOption: true,
    },
    {
      i18nKey: 'wallet_recharge_with_bonus_reminder_content_3',
    },
    {
      i18nKey: 'wallet_recharge_with_bonus_reminder_content_4',
      className: '',
    },
  ];

  // 复充 高级奖励
  const depositHighBonusDescriptionList: RechargeDescriptionItem[] = [
    {
      i18nKey: 'wallet_recharge_premium_bonus_reminder_content_1',
    },
    {
      i18nKey: 'wallet_recharge_premium_bonus_reminder_content_2',
    },
    {
      i18nKey: 'wallet_recharge_premium_bonus_reminder_content_3',
      useI18nOption: true,
    },
    {
      i18nKey: 'wallet_recharge_premium_bonus_reminder_content_4',
      className: '',
    },
  ];

  const descriptionOptions = useMemo(() => {
    return {
      payChannelName: currentPayChannel.displayName,
      cashBackRate: currentOptCashBackRate,
      currentAmount: formatMoney(currentOptAmount || 0),
      currentRebateAmount: formatMoney(currentOptRebateAmount || 0),
    };
  }, [
    currentPayChannel,
    currentOptCashBackRate,
    currentOptAmount,
    currentOptRebateAmount,
  ]);

  const descriptionItems = useMemo(() => {
    const isHighBonus = currentRechargeCard === RechargeCard.HIGH_BONUS;
    if (isFirstDeposit) {
      return isHighBonus
        ? firstDepositHighBonusDescriptionList
        : firstDepositDescriptionList;
    } else {
      return isHighBonus
        ? depositHighBonusDescriptionList
        : depositDescriptionList;
    }
  }, [isFirstDeposit, currentRechargeCard]);

  return {
    descriptionOptions: descriptionOptions,
    descriptionList: descriptionItems,
  };
};

export default useHighBonusRechargeDescription;
