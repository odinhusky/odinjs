import { useTranslation } from 'react-i18next';
import { formatMoney } from '@mode2/utils';
import cx from '@commonUtils/cx';
import StarMark from '@components/StarMark';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';
import {
  RechargeCard,
  useWalletPageRechargeCardStore,
} from '@mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';

export const RechargeCardDescription = () => {
  const { t } = useTranslation();
  const currentRechargeCard = useWalletPageRechargeCardStore(
    (state) => state.currentRechargeCard
  );

  const currentPayChannel = useWalletPageRechargeContentStore(
    (state) => state.currentPayChannel
  );

  const currentOptAmount = useWalletPageRechargeContentStore(
    (state) => state.currentOptAmount
  );
  const currentOptRebateAmount = useWalletPageRechargeContentStore(
    (state) => state.currentOptRebateAmount
  );
  const currentOptCashBackRate = useWalletPageRechargeContentStore(
    (state) => state.currentOptCashBackRate
  );

  const currentAmount = formatMoney(currentOptAmount || 0);
  const currentRebateAmount = formatMoney(currentOptRebateAmount || 0);
  const currentRatioAmount = formatMoney((currentOptAmount || 0) * 1.5);

  return (
    <div
      className={cx(
        'flex justify-start flex-row items-center',
        'bgi-text-[var(--state-warn-main)]'
      )}
    >
      <StarMark className="mr-[4px]" />

      <div
        className={cx(
          'text-sm font-medium',
          'flex justify-start flex-col text-center flex text-left'
        )}
      >
        {currentRechargeCard === RechargeCard.TOP_UP_BONUS ? (
          <div>
            <p>{t('wallet_deposit_note_deposit_bonus_1')}</p>
            <p>{t('wallet_deposit_note_deposit_bonus_2')}</p>
            <p className={'mt-3'}></p>
            <p>{t('wallet_deposit_note_deposit_bonus_3')}</p>
            <p>
              {t('wallet_deposit_note_deposit_bonus_4', {
                payChannelName: currentPayChannel.displayName,
                cashBackRate: currentOptCashBackRate,
              })}
            </p>
            <p>
              {t('wallet_deposit_note_deposit_bonus_5', {
                currentAmount: currentAmount,
                currentRebateAmount: currentRebateAmount,
              })}
            </p>
          </div>
        ) : (
          <div>
            <p>{t('wallet_deposit_note_deposit_default')}</p>
            <p>
              {t('wallet_deposit_note_deposit_default_1', {
                ratio: '1.5',
                currentAmount: currentAmount,
                currentRatioAmount: currentRatioAmount,
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
