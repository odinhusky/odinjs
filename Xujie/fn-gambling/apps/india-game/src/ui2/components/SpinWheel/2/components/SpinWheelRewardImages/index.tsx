import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_JUSTIFY_CENTER } from '@libs/constant/style';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';

const rewardItemToImgNameTable: Record<number, string> = {
  1: 'deposit_wheel_rewards',
  2: 'invite_rewards_goal_1',
  3: 'invite_rewards_goal_2',
  4: 'invite_rewards_goal_3',
  5: 'invite_rewards_goal_4',
  6: 'invite_rewards_goal_5',
  7: 'silver_wheel_s',
  8: 'gold_wheel_s',
  9: 'diamond_wheel_s',
  10: 'supreme_wheel_s',
  11: 'invitation_wheel_rewards_1',
  12: 'invitation_wheel_rewards_2',
  13: 'invitation_wheel_rewards_3',
  14: 'invitation_wheel_rewards_4',
  15: 'invite_rewards_icon_1',
  16: 'invite_rewards_icon_2',
  17: 'invite_rewards_icon_3',
  18: 'invite_rewards_icon_4',
  19: 'invite_rewards_icon_5',
  20: 'invite_rewards_icon_6',
  21: 'invite_rewards_icon_7',
  22: 'invite_rewards_icon_8'
};

interface SpinWheelRewardImagesProps {
  rouletteClass: string;
  rewardOrder: number;
  className?: string;
  rewardImageClass?: string;
}

export const SpinWheelRewardImages = ({
  rouletteClass,
  rewardOrder,
  className,
  rewardImageClass,
}: SpinWheelRewardImagesProps) => {
  return (
    <div
      className={cx(
        rouletteClass,
        'absolute',
        'top-[12%] left-[27%]',
        FLEX_JUSTIFY_CENTER,
        'rotate-[-67deg]',
        className
      )}
    >
      <div className={cx('w-[30px] h-[30px]', FLEX_CENTER, rewardImageClass)}>
        <img
          src={getImgUrl(
            EResourceLevel.V,
            rewardItemToImgNameTable[rewardOrder] || rewardItemToImgNameTable[1]
          )}
          alt="Wheel reward image"
          className={cx('block', 'w-[90%]')}
        />
      </div>
    </div>
  );
};

export default SpinWheelRewardImages;
