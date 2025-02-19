import {
  RechargeCard,
  useWalletPageRechargeCardStore,
} from '@mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';
import StarMark from '@components/StarMark';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import cx from '@commonUtils/cx';
import { EResourceLevel, formatMoney, getImgUrl } from '@mode2/utils';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';

const BonusWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cx(
        'relative cursor-pointer',
        'bgi-border-[var(--base-1-variant1)]',
        'rounded-md border-[1.5px]',
        'bgi-[var(--base-2-variant4)]'
      )}
    >
      <div className={'w-auto h-full'}>
        <img
          alt={'check_box'}
          className="absolute right-0 bottom-0 rounded-br-[5px] h-8 w-8"
          src={getImgUrl(EResourceLevel.V, 'check_box')}
        />
        {children}
      </div>
    </div>
  );
};
const NoBonusWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cx(
        'relative cursor-pointer',
        'rounded-md border-[1.5px]',
        'bgi-[var(--base-2-variant11)]',
        'bgi-border-[var(--base-2-variant6)]'
      )}
    >
      <div className={'w-auto h-full'}>{children}</div>
    </div>
  );
};
export const RechargeBonusSwitch = () => {
  const { t } = useTranslation();
  const currentRechargeCard = useWalletPageRechargeCardStore(
    (state) => state.currentRechargeCard
  );

  const setCurrentRechargeCard = useWalletPageRechargeCardStore(
    (state) => state.setCurrentRechargeCard
  );

  const currentOptCashBackRate = useWalletPageRechargeContentStore(
    (state) => state.currentOptCashBackRate
  );

  const currentPayChannel = useWalletPageRechargeContentStore(
    (state) => state.currentPayChannel
  );

  const isFirstDeposit = useUserProfileStore((state) => state.isFirstDeposit);

  const isWithBonus =
    currentRechargeCard === RechargeCard.TOP_UP_BONUS ||
    currentRechargeCard === RechargeCard.HIGH_BONUS;

  // TODO i18n
  const bonusMessage = isFirstDeposit
    ? t(
        `First deposit up to +${formatMoney(currentPayChannel.maxRebateAmount)}`
      )
    : t(`+${currentOptCashBackRate}% bonus`);
  const Wrapper = isWithBonus ? BonusWrapper : NoBonusWrapper;

  // TODO i18n
  return (
    <div className="flex flex-col gap-3 justify-start">
      <div>
        <div className={'grid grid-cols-3 gap-y-3 gap-x-2'}>
          <Wrapper>
            <div
              className="text-sm bgi-text-[var(--grayscale-100)] min-h-[56px] flex justify-center items-center p-1"
              onClick={() => {
                setCurrentRechargeCard(
                  isWithBonus ? RechargeCard.GENERAL : RechargeCard.TOP_UP_BONUS
                );
              }}
            >
              {bonusMessage}
            </div>
          </Wrapper>
        </div>

        <div className="flex gap-1 text-base font-medium bgi-text-[var(--grayscale-100)] mt-1">
          <p>{t('Deposit Event')}</p>
          <StarMark className={'!bgi-text-[var(--base-1-main)]'} />
        </div>
      </div>

      {isWithBonus ? (
        <div className="bgi-text-[var(--base-1-main)] font-medium text-xs">
          {t(
            'After participating in this event, your withdrawal will require a wagering\n' +
              'requirement of 3 times the deposit amount.\n' +
              "You can cancel if you don't need the bonus"
          )}
        </div>
      ) : null}
    </div>
  );
};

export default RechargeBonusSwitch;
