import cx from 'apps/gambling/src/app/ui/utils/cx';
import { XY_CENTER, X_CENTER } from 'apps/gambling/src/assets/constant/style';
import { environment } from 'apps/gambling/src/environments/environment';
import { rouletteClass } from '../luckyWheelStyle';
import LuckyWheelRewardAmount from './LuckyWheelRewardAmount';
import LuckyWheelBgLightAnimation from './LuckyWheelBgLightAnimation';

interface LuckyWheelFixedPartsProps {
  isAnimating: boolean;
  lowerCaseLevel: string;
  showRewardAmount: number;
  onClickTrigger: () => void;
}

export const LuckyWheelFixedParts = ({
  isAnimating,
  lowerCaseLevel,
  showRewardAmount,
  onClickTrigger,
}: LuckyWheelFixedPartsProps) => {
  const isShowReward = showRewardAmount > 0;

  return (
    <div className={cx('absolute top-0 left-0', rouletteClass)}>
      {/* 指針匡 */}
      <img
        className={cx(rouletteClass, 'absolute top-0 left-0')}
        src={`assets/${environment.uVersion}/wheel_${lowerCaseLevel}_frame.png`}
        alt="Wheel pointer frame image"
      />

      <div
        className={cx(
          'w-[30%]',
          'se:w-[93px] se:h-[93px]',
          'tab:w-[124px] tab:h-[124px]',
          'absolute z-2',
          XY_CENTER
        )}
        onClick={isAnimating ? () => {} : onClickTrigger}
      >
        {/* 指針三角形 */}
        <img
          className={cx(
            'w-[24px] h-[18px]',
            'tab:w-[31px] tab:h-[24px]',
            'absolute top-[-14px] tab:top-[-20px] z-2',
            X_CENTER
          )}
          src={`assets/${environment.uVersion}/wheel_${lowerCaseLevel}_pointer.png`}
          alt="Wheel pointer image"
        />

        {/* 中間的按鈕背景 */}
        <img
          className={cx(
            'w-full h-full',
            'relative z-3',
            `${isAnimating ? '' : 'cursor-pointer'}`
          )}
          src={`assets/${environment.uVersion}/wheel_${lowerCaseLevel}_btn.png`}
          alt="Wheel center button image"
        />

        {/* 抽獎的文字圖片 */}
        <img
          className={cx(
            'w-[66%]',
            'se:w-[61.5px] se:h-[10.5px]',
            'tab:w-[82px] tab:h-[14px]',
            'absolute z-3',
            XY_CENTER
          )}
          src={`assets/${environment.uVersion}/draw.png`}
          alt="Draw text image"
        />
      </div>

      <div
        className={cx('w-full h-full', 'absolute z-3', XY_CENTER, {
          hidden: !isShowReward,
        })}
      >
        {/* 抽獎後顯示中獎背景 */}
        <LuckyWheelBgLightAnimation isShowReward={isShowReward} />

        {/* 抽獎後顯示中獎金額: 如果為0就不顯示 */}
        <LuckyWheelRewardAmount showRewardAmount={showRewardAmount} />
      </div>
    </div>
  );
};

export default LuckyWheelFixedParts;
