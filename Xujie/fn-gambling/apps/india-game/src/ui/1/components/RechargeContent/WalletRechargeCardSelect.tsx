import { cx } from '@libs/commonUtils';
import Icon from '@components/Icon';
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
          name="ic_check"
          color={isWithBonus ? '' : '#00000000'}
          className={cx(
            'w-6 h-6 mobile:w-7 mobile:h-7 p-0.5',
            'cursor-pointer rounded-full',
            {
              'bgi-[var(--base-1-main)] ': isWithBonus,
              'border rounded-full': !isWithBonus,
            }
          )}
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
        <div className="p-[1.5px] bgi-[var(--state-warn-main)] rounded mt-1 inline-block">
          <div
            className={cx(
              'bgi-text-[var(--grayscale-100)] font-medium  rounded px-2 py-1 text-xs '
            )}
          >
            {t('wallet_deposit_cash_back_custom', {
              cashBackRate: currentOptCashBackRate,
            })}
          </div>
        </div>
      )}
    </div>
  );
};
