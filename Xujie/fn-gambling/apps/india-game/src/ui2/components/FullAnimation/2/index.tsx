import { cx, useUpdateEffect } from '@libs/commonUtils';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import fullAnimationStore, {
  AnimationType,
} from '@mode2/zustand/components/fullAnimationStore';
import { useMemo } from 'react';
import BaseModal from '@libs/components/Modal';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';

export const FullAnimation = () => {
  const isShowFullAnimation = fullAnimationStore(
    (state) => state.isShowFullAnimation
  );

  const setIsShowFullAnimation = fullAnimationStore(
    (state) => state.setIsShowFullAnimation
  );

  const fullAnimationType = fullAnimationStore(
    (state) => state.fullAnimationType
  );
  const fullAnimationDuration = fullAnimationStore(
    (state) => state.fullAnimationDuration
  );

  useUpdateEffect(() => {
    if (isShowFullAnimation) {
      document.querySelector('body')?.classList.add('overflow-hidden');

      const x = setTimeout(() => {
        setIsShowFullAnimation(false);
      }, fullAnimationDuration);

      return () => {
        clearTimeout(x);
      };
    } else {
      document.querySelector('body')?.classList.remove('overflow-hidden');
    }
  }, [isShowFullAnimation]);

  const fullAnimation: JSX.Element | null = useMemo(() => {
    switch (fullAnimationType) {
      case AnimationType.RECHARGE_WHEEL_GET_MONEY:
        return (
          <BaseCacheImg
            src={getImgUrl(
              EResourceLevel.V,
              'deposit_wheel_get_rewards',
              '.webp'
            )}
            imgName="deposit_wheel_get_rewards.webp"
            alt="Recharg eWheel Get Money Animation"
            className={cx('w-full')}
          />
        );
      case AnimationType.DAILY_BET_REBATE_CLAIM:
        return (
          <BaseCacheImg
            src={getImgUrl(EResourceLevel.V, 'popup_bet_rebate_3', '.webp')}
            alt="Popup Bet Rebate Animation"
            className={cx('w-full')}
            imgName="popup_bet_rebate_3.webp"
          />
        );
      case AnimationType.GIFT_CODE_SUCCESS:
        return (
          <BaseCacheImg
            src={getImgUrl(EResourceLevel.V, 'gift_code_success', '.webp')}
            alt="Gift Code Success Animation"
            className={cx('w-full')}
            imgName="gift_code_success.webp"
          />
        );
      default:
        return null;
    }
  }, [fullAnimationType, isShowFullAnimation]);

  return isShowFullAnimation ? (
    // Evan 需要用 <BaseModal> 包裝，避免列隊中的 modal 先顯示出來
    <BaseModal className="w-screen max-w-[750px] m-auto h-screen !bgi-[var(--transparent-gray-10)]">
      <div
        id="fullAnimation"
        className={cx(
          'w-screen max-w-[750px] h-screen',
          'mx-auto',
          'fixed inset-0 z-[1006]'
        )}
      >
        {fullAnimation}
      </div>
    </BaseModal>
  ) : null;
};

export default FullAnimation;
