import React, { useMemo } from 'react';
import { useDurationCountDown } from '@libs/commonUtils';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';
import { EResourceLevel, formatCountdownTime, getImgUrl } from '@mode2/utils';
import Avatar from '@components/Avatar';
import cx from '@commonUtils/cx';
import { Icon } from '@components/Icon';
import dayjs from 'dayjs';
import useRechargeSecretPageStore from '@libs/mode2/zustand/page/rechargeSecretPageStore';

export const RechargeSecretPlayerInfo = () => {
  const rechargeSecretLimitedOffersEndTime = useRechargeSecretPageStore(
    (state) => state.rechargeSecretLimitedOffersEndTime
  );

  const countdownTime = useMemo(() => {
    const nowUnix = dayjs().unix();
    return rechargeSecretLimitedOffersEndTime > nowUnix
      ? rechargeSecretLimitedOffersEndTime - nowUnix
      : 0;
  }, [rechargeSecretLimitedOffersEndTime]);

  const { remainSec } = useDurationCountDown({
    duration: countdownTime,
    onEnd: () => {
      console.log('Happy New Year!');
    },
  });

  const nickname = useUserProfileStore((state) => state.nickname);
  return (
    <div
      className={cx('relative', 'flex flex-col items-center justify-center')}
    >
      <div className={'mt-[87px]'}>
        <BaseCacheImg
          className={'w-[184px] h-[192px]'}
          src={getImgUrl(EResourceLevel.V, 'secret_bonus_nickname_background')}
        />
      </div>

      <Avatar
        rootClassName={'w-20 h-20 absolute top-[56px]'}
        className={'!w-full !h-full'}
        isGuest={false}
        isShowVIP={false}
      />

      <BaseCacheImg
        className={'absolute top-[16px] w-[264px] h-[143px]'}
        src={getImgUrl(EResourceLevel.V, 'secret_bonus_avatar_frame')}
      />

      <BaseCacheImg
        className={'absolute bottom-[62px] w-[156.63px] h-[62.65px]'}
        src={getImgUrl(EResourceLevel.V, 'secret_bonus_nickname_label')}
      />

      <div
        className={cx(
          'absolute bottom-[62px]',
          'w-[156.63px] h-[62.65px] p-2',
          'items-center',
          'bgi-text-[var(--base-1-40)] text-base font-medium text-center truncate'
        )}
      >
        <p className={'h-full content-center text-ellipsis overflow-hidden'}>
          {nickname}
        </p>
      </div>

      <div
        className={cx(
          'absolute bottom-0',
          'px-4 py-1 flex gap-1.5',
          'bgi-[var(--base-2-variant14)]',
          'rounded-full border bgi-border-[var(--base-1-main)]',
          'bgi-text-[var(--base-1-main)] text-sm'
        )}
      >
        <Icon className={'w-5 h-5'} name={'ic_pending_outline_4'} />
        {`Expires in ${formatCountdownTime(remainSec)}`}
      </div>
    </div>
  );
};

export default RechargeSecretPlayerInfo;
