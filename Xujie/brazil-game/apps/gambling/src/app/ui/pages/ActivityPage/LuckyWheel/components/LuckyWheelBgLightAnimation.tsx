import cx from 'apps/gambling/src/app/ui/utils/cx';
import { environment } from 'apps/gambling/src/environments/environment';
import { useEffect, useState } from 'react';
import {
  HAS_REWARD_BG_IN_ANIMATION_U_VERSION,
  HAS_REWARD_BG_OUT_ANIMATION_U_VERSION,
  HAS_REWARD_BG_U_VERSION,
  REWARD_LIGHT_SHOW_TIME,
} from '../LuckyWheelConst';
import { XY_CENTER } from 'apps/gambling/src/assets/constant/style';

interface LuckyWheelBgLightAnimationProps {
  isShowReward: boolean;
}

export const LuckyWheelBgLightAnimation = ({
  isShowReward,
}: LuckyWheelBgLightAnimationProps) => {
  const isShowRewardBg =
    isShowReward && HAS_REWARD_BG_U_VERSION.includes(environment.uVersion);

  // u6 才需要的動畫效果，背景的光縮放
  const [isCloseLight, setIsCloseLight] = useState(true);

  const isShowInAnimation = HAS_REWARD_BG_IN_ANIMATION_U_VERSION.includes(
    environment.uVersion
  );
  const isShowOutAnimation =
    isCloseLight &&
    HAS_REWARD_BG_OUT_ANIMATION_U_VERSION.includes(environment.uVersion);

  useEffect(() => {
    if (!isShowInAnimation) return;
    if (isShowRewardBg) {
      setIsCloseLight(false);
      let x = setTimeout(() => {
        setIsCloseLight(true);
      }, REWARD_LIGHT_SHOW_TIME);

      return () => {
        clearTimeout(x);
      };
    } else {
      setIsCloseLight(true);
    }
  }, [environment.uVersion, isShowRewardBg, isShowInAnimation]);

  return (
    <>
      {isShowRewardBg ? (
        <div className={cx('absolute z-4', XY_CENTER, 'w-full')}>
          <img
            src={`assets/${environment.uVersion}/bg_lucky_wheel_reward.png`}
            className={cx('w-full', 'bg-reward', {
              animate__customZoomIn: isShowInAnimation,
              animate__customZoomOut: isShowOutAnimation,
            })}
          />
        </div>
      ) : null}
    </>
  );
};

export default LuckyWheelBgLightAnimation;
