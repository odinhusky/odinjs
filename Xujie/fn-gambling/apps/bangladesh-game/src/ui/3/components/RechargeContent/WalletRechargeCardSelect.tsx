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

  const currentPayChannel = useWalletPageRechargeContentStore(
    (state) => state.currentPayChannel
  );

  const isWithBonus = currentRechargeCard === RechargeCard.TOP_UP_BONUS;
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div
          className={cx(
            'w-6 h-6 mobile:w-7 mobile:h-7 p-0.5 rounded-full border border-[var(--grayscale-70)] cursor-pointer',
            isWithBonus ? 'bgi-[var(--base-2-main)]' : ''
          )}
          onClick={() => {
            const item = rechargeCardList.find(
              (v) => v.card !== currentRechargeCard
            );
            item?.onAction();
          }}
        >
          <Icon
            name="ic_check"
            className={cx('w-full h-full', isWithBonus ? '' : 'hidden')}
          />
        </div>
        <span className="text-sm mobile:text-base text-[var(--grayscale-100)]">
          {t('wallet_deposit_with_bonus')}
        </span>
      </div>
      {isWithBonus && (
        <div className="p-[1.5px] bgi-[var(--base-2-main)] rounded mt-1 inline-block">
          <div className="bg-[var(--grayscale-20)] rounded">
            <div
              className={cx(
                'bgi-text-[var(--base-2-main)] font-medium  rounded px-2 py-1 text-xs '
              )}
            >
              {t('wallet_deposit_bonus', {
                cashBackRate: currentPayChannel.maxCashBackRate,
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
