import { cx } from '@libs/commonUtils';
import Icon from '@libs/mode2/components/Icon';
import { useTranslation } from 'react-i18next';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';
import {
  RechargeCard,
  useWalletPageRechargeCardStore,
} from '@mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';

export const WalletRechargeCardSelect = () => {
  const currentRechargeCard = useWalletPageRechargeCardStore(
    (state) => state.currentRechargeCard
  );

  const rechargeCardList = useWalletPageRechargeCardStore(
    (state) => state.rechargeCardList
  );
  const { t } = useTranslation();

  const currentOptCashBackRate = useWalletPageRechargeContentStore(
    (state) => state.currentOptCashBackRate
  );

  const isWithBonus = currentRechargeCard === RechargeCard.TOP_UP_BONUS;
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Icon
          className={cx(
            'w-6 h-6 mobile:w-7 mobile:h-7 p-0.5 rounded-full border cursor-pointer',
            {
              'border-[var(--grayscale-50)] bg-transparent': !isWithBonus,
              'bgi-[var(--state-success-main)]': isWithBonus,
            }
          )}
          name={isWithBonus ? 'ic_check' : ''}
          onClick={() => {
            const item = rechargeCardList.find(
              (v) => v.card !== currentRechargeCard
            );
            item?.onAction();
          }}
        />
        <span className="text-sm mobile:text-base text-[var(--grayscale-100)]">
          {t('wallet_deposit_with_bonus')}
        </span>
      </div>
      {isWithBonus && (
        <div
          className={cx(
            'bgi-border-[var(--state-warn-main)] after:rounded  inline-block',
            'mt-1 px-2 py-px',
            'text-xs mobile:text-sm bgi-text-[var(--state-warn-main)] font-medium'
          )}
        >
          {t('wallet_deposit_bonus', {
            cashBackRate: currentOptCashBackRate,
          })}
        </div>
      )}
    </div>
  );
};
