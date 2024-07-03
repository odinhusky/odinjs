import { LuckyWheelUnit } from "apps/gambling/src/app/external/endpoint/activity/luckyWheel/GetLuckyWheelConfigEndpoint";
import cx from "apps/gambling/src/app/ui/utils/cx";
import { environment } from "apps/gambling/src/environments/environment";
import { rouletteClass } from "../luckyWheelStyle";

interface LuckyWheelCoinImagesProps {
  rewardItem: LuckyWheelUnit;
}

export const LuckyWheelCoinImages = ({
  rewardItem
}: LuckyWheelCoinImagesProps) => {

  // = styles
  const coinClass = cx(
    'w-[28px] h-[22px]',
    'tab:w-[42px] tab:h-[32px]',
    'hidden'
  );

  return (
    <div className={cx(
      rouletteClass,
      'absolute',
      'top-[11%] left-[19%]',
      'se:top-[30px] se:left-[57px]',
      'tab:top-[41px] tab:left-[75px]',
      'flex justify-center',
      'rotate-[-67deg]'
    )}>
      <img
        className={cx(
          coinClass,
          { 'block': rewardItem.icon === 'icon1'}
        )}
        src={`assets/${environment.uVersion}/icon_reward_s.png`}
        alt="Less coins image"
      />

      <img
        className={cx(
          coinClass,
          { 'block': rewardItem.icon === 'icon2'}
        )}
        src={`assets/${environment.uVersion}/icon_reward_m.png`}
        alt="More coins image"
      />

      <img
        className={cx(
          coinClass,
          { 'block': rewardItem.icon === 'icon3'}
        )}
        src={`assets/${environment.uVersion}/icon_reward_l.png`}
        alt="Abundant coins image"
      />
    </div>
  )
}

export default LuckyWheelCoinImages;