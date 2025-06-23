import { BaseCacheImg } from '@mode2/components/BaseCacheImg';
import { EResourceLevel, formatCountdownTime, getImgUrl } from '@mode2/utils';
import cx from '@commonUtils/cx';
import { Icon } from '@components/Icon';
import React, { useMemo } from 'react';
import { useDurationCountDown } from '@libs/commonUtils';
import dayjs from 'dayjs';
import useDepositJackpotWheelModalStore from '@mode2/zustand/modal/DepositJackpotWheelModal';

export const DoubleBuffRechargeBonusTitle = () => {
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
  return remainSec > 0 ? (
    <div className="flex flex-col justify-center items-center relative  -mt-4 -mx-4">
      <BaseCacheImg
        className={'w-full'}
        alt={'2x_deposit_bonus_background'}
        src={getImgUrl(EResourceLevel.V, '2x_deposit_bonus_background')}
      />

      <div className="absolute w-full flex flex-col justify-center items-center gap-4 px-4 py-5">
        <BaseCacheImg
          className="w-full"
          alt={'2x_deposit_bonus_title'}
          src={getImgUrl(EResourceLevel.V, '2x_deposit_bonus_title')}
        />
        <div
          className={cx(
            // 'absolute bottom-0',
            'px-4 py-1 flex gap-1.5 justify-center items-center ',
            'bgi-[var(--base-2-variant14)]',
            'rounded-full border bgi-border-[var(--base-1-main)]',
            'bgi-text-[var(--base-1-main)] text-sm text-center leading-none'
          )}
        >
          <Icon className={'w-5 h-5'} name={'ic_pending_outline_4'} />
          <p>{`The event will end after ${formatCountdownTime(remainSec)}`}</p>
        </div>
      </div>
    </div>
  ) : null;
};

export default DoubleBuffRechargeBonusTitle;
