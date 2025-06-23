import { cx, useDurationCountDown } from '@libs/commonUtils';
import { Icon } from '@components/Icon';
import { LowBalanceRescueBoxButtonProps } from '../LowBalanceRescueBoxButtonProps';
import useLowBalanceRescueBoxModalActions from '@libs/mode2/action/model/LowBalanceRescueBoxModalAction/useLowBalanceRescueBoxModalActions';
import { handleLowBalanceRescueBoxModalNavCoinBtnClick } from '@libs/mode2/action/actionTypes';
import { FLEX_CENTER } from '@libs/constant/style';
import '@fortawesome/fontawesome-free/css/all.min.css';
import useLowBalanceRescueBoxModalStore from '@mode2/zustand/modal/LowBalanceRescueBoxModal';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

export const LowBalanceRescueBoxButton = ({
  isShowText = false,
  className,
  iconClassName,
  icTipsClassName,
}: LowBalanceRescueBoxButtonProps) => {
  const { handleLowBalanceRescueBoxModalClick } =
    useLowBalanceRescueBoxModalActions();

  const [isShow, setShow] = useState(false);

  const lowBalanceRescueBoxLimitedOffersEndTime =
    useLowBalanceRescueBoxModalStore(
      (state) => state.lowBalanceRescueBoxLimitedOffersEndTime
    );

  const nowUnix = dayjs().unix();
  const countdownTime = useMemo(() => {
    const time =
      lowBalanceRescueBoxLimitedOffersEndTime > nowUnix
        ? lowBalanceRescueBoxLimitedOffersEndTime - nowUnix
        : 0;
    setShow(time > 0);
    return time;
  }, [lowBalanceRescueBoxLimitedOffersEndTime]);

  useDurationCountDown({
    duration: countdownTime,
    onEnd: () => {
      setShow(false);
    },
    key: 'lowBalanceRescueBoxButtonCountDown',
  });

  return isShow ? (
    <button
      className={cx(
        'w-12 h-12',
        'bgi-text-[var(--base-1-main)] whitespace-nowrap',
        'cursor-pointer',
        'relative',
        'flex flex-col items-center',
        className
      )}
      onClick={() => {
        handleLowBalanceRescueBoxModalClick({
          actionName: handleLowBalanceRescueBoxModalNavCoinBtnClick,
        });
      }}
    >
      <div className="w-fit relative">
        <Icon
          name={'ic_rupee_coin'}
          className={cx('w-full h-auto', iconClassName)}
        />
        <Icon
          name={'ic_tips_2_fill_3'}
          className={cx(
            'w-1/3 h-1/3 absolute top-0 right-0 fa-bounce',
            icTipsClassName
          )}
        />
      </div>
      {isShowText ? (
        <div
          className={cx(
            'text-sm',
            'bgi-text-[var(--grayscale-10)]',
            'font-medium',
            FLEX_CENTER
          )}
        >
          Bonus
        </div>
      ) : null}
    </button>
  ) : null;
};

export default LowBalanceRescueBoxButton;
