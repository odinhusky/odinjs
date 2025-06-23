import cx from '@commonUtils/cx';
import { formatMoney } from '@mode2/utils';
import {
  PayOptionItem,
  useWalletPageRechargeContentStore,
} from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';
import {
  RechargeCard,
  useWalletPageRechargeCardStore,
} from '@mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';
import useDepositJackpotWheelModalStore from '@mode2/zustand/modal/DepositJackpotWheelModal';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { useDurationCountDown } from '@libs/commonUtils';

/**
 * Evan for [V6] Done
 */
const PlaceholdersItem = () => {
  return (
    <div
      className={cx(
        'flex justify-center items-center rounded-md',
        'py-2.5 px-2',
        'font-medium text-xl'
      )}
    >
      <p>{'ㅤ'} </p>
    </div>
  );
};

/**
 * Evan for [V6] Done
 */
const PayProductAmountItem = ({
  item,
  remainSec,
}: {
  item: PayOptionItem;
  remainSec: number;
}) => {
  /* 當前充值選項索引 */
  const currentOptIndexKey = useWalletPageRechargeContentStore(
    (state) => state.currentOptIndexKey
  );

  const currentRechargeCard = useWalletPageRechargeCardStore(
    (state) => state.currentRechargeCard
  );

  const rebateAmount = item.rebateAmount;

  const isBonusMode =
    rebateAmount > 0
      ? currentRechargeCard === RechargeCard.TOP_UP_BONUS ||
        currentRechargeCard === RechargeCard.HIGH_BONUS
      : false;

  const isActive = item.indexKey === currentOptIndexKey;
  return (
    <div
      className={cx(
        'relative w-full',
        'flex justify-center items-center',
        'cursor-pointer',
        'rounded-md',
        'font-medium bgi-text-[var(--base-1-main)]',
        {
          'bgi-border-[var(--base-1-variant1)] after:rounded-md after:border-[1.5px]':
            isActive,
          'bgi-[var(--base-2-variant4)]': isActive,
          'bgi-[var(--base-2-variant6)]': !isActive,
        }
      )}
      onClick={item.onAction}
    >
      <p
        className={cx(
          'my-2.5 mx-0.5 w-full text-center',
          'text-[clamp(18px,0.5rem,20px)]'
        )}
      >
        {formatMoney({ value: item?.amount })}
      </p>

      {isBonusMode ? (
        <div
          className={cx(
            'absolute -top-2 right-0 z-10',
            'px-2 py-[0.5px] rounded-tl-md rounded-br-md',
            'text-xs bgi-text-[var(--grayscale-100)] font-normal',
            {
              'bgi-[var(--linear-3)]': isActive,
              'bgi-[var(--linear-4)]': !isActive,
            }
          )}
        >
          {`+${formatMoney({
            value: remainSec > 0 ? rebateAmount * 2 : rebateAmount,
            showCurrency: false,
            includeDecimal: false,
          })}`}
        </div>
      ) : null}
    </div>
  );
};

/**
 * Evan for [V6] Done
 */
export const PayChannelAmountOptions = () => {
  /* 當前選定支付通道-充值選項 */
  const currentPayOptionItems = useWalletPageRechargeContentStore(
    (state) => state.currentPayOptionItems
  );

  const fillCount = Math.max(0, 12 - currentPayOptionItems.length);
  const placeholders = Array(fillCount).fill(null);

  const doubleBuffRechargeBonusLimitedEndTime =
    useDepositJackpotWheelModalStore(
      (state) => state.doubleBuffRechargeBonusLimitedEndTime
    );

  const countdownTime = useMemo(() => {
    const nowUnix = dayjs().unix();
    return doubleBuffRechargeBonusLimitedEndTime > nowUnix
      ? doubleBuffRechargeBonusLimitedEndTime - nowUnix
      : 0;
  }, [doubleBuffRechargeBonusLimitedEndTime]);

  const { remainSec } = useDurationCountDown({
    duration: countdownTime,
    onEnd: () => {
      console.log('Happy New Year!');
    },
  });

  return (
    <div className={cx('select-none', 'grid grid-cols-4 gap-y-3 gap-x-2 py-2')}>
      {currentPayOptionItems.map((item, index) => {
        return (
          <PayProductAmountItem
            key={`${item.indexKey}${index}`}
            item={item}
            remainSec={remainSec}
          />
        );
      })}

      {/* 未滿三行 佔位符 */}
      {placeholders.map((item, index) => {
        return <PlaceholdersItem key={`${index}`} />;
      })}
    </div>
  );
};

export default PayChannelAmountOptions;
