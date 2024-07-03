import cx from 'apps/gambling/src/app/ui/utils/cx';
import { environment } from 'apps/gambling/src/environments/environment';
import { HAS_COINS_DROP_ANIMATION_U_VERSION } from '../LuckyWheelConst';

interface LuckyWheelCoinsDropAnimationProps {
  showRewardAmount: number;
}

export const LuckyWheelCoinsDropAnimation = ({
  showRewardAmount,
}: LuckyWheelCoinsDropAnimationProps) => {
  const isShow = HAS_COINS_DROP_ANIMATION_U_VERSION.includes(
    environment.uVersion
  );

  return (
    <>
      {isShow ? (
        <div
          className={cx('w-full', 'absolute z-[3]', 'top-[-260%] left-0', {
            animate__customCoinsDrop: showRewardAmount > 0,
          })}
        >
          <img
            className={cx('w-full')}
            src={`assets/${environment.uVersion}/bg_coins_fly.png`}
            alt="Coins Dropping"
          />
        </div>
      ) : null}
    </>
  );
};

export default LuckyWheelCoinsDropAnimation;
