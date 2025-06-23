import { cx } from '@libs/commonUtils';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { forwardRef } from 'react';
import SpinWheelRewardImages from '../SpinWheelRewardImages';
import { WheelSegmentCategoryResult } from '@libs/mode2/external/api/endpoint/wheel/PostWheelConfigEndpoint';
import { rechargeWheelLevelTypeMapping } from '@libs/mode2/@types/rechargeWheelLevelTypes';
import capitalize from 'lodash/capitalize';
import SpinWheelRewardText from '../SpinWheelRewardText';
import { SpinWheelSpinPartProps } from '@components/SpinWheel/SpinWheelProps';

export const SpinWheelSpinPart = forwardRef<
  HTMLDivElement,
  SpinWheelSpinPartProps
>(
  (
    {
      category,
      wheelBgImgName,
      spinPartClassNameObj,
      wheelSegments,
      rouletteClass,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cx(
          'relative',
          rouletteClass,
          'overflow-hidden',
          spinPartClassNameObj?.container
        )}
      >
        {/* 輪盤的底 */}
        <img
          src={getImgUrl(EResourceLevel.V, wheelBgImgName)}
          alt="Wheel image"
          className={cx(
            'block',
            'w-full h-full',
            spinPartClassNameObj?.surface
          )}
        />

        {wheelSegments?.map((item, index) => {
          const isMoneyAsReward =
            item.category === WheelSegmentCategoryResult.AMOUNT;

          const rewardWheelType = capitalize(
            rechargeWheelLevelTypeMapping[item.wheelLevel]
          );

          // const rewardOrder =
          //   category === 'recharge'
          //     ? !isMoneyAsReward
          //       ? item.wheelLevel + 6
          //       : item.icon || 1
          //     : item.icon;

          return (
            <div
              key={`${category} - wheel - section - ${index}`}
              className={cx(
                rouletteClass,
                'absolute top-0 left-0',
                'rounded-[50%]'
              )}
              style={{
                clipPath: 'polygon(0% 5%, 50% 50%, 0% 50%, 0% 0%)',
                transform: `rotate(${
                  45 * index + (spinPartClassNameObj?.rouletteRotateOffset || 0)
                }deg)`,
              }}
            >
              {/* 獎項文字 */}
              <SpinWheelRewardText
                category={category}
                isMoneyAsReward={isMoneyAsReward}
                value={item.value}
                rewardWheelType={rewardWheelType}
                rouletteClass={rouletteClass}
                rewardTitleClass={spinPartClassNameObj?.rewardTitleClass}
                rechargeRewardClass={spinPartClassNameObj?.rechargeRewardClass}
                rechargeIsMoneyRewardClass={
                  spinPartClassNameObj?.rechargeIsMoneyRewardClass
                }
                rechargeNotMoneyRewardClass={
                  spinPartClassNameObj?.rechargeNotMoneyRewardClass
                }
                inviteRewardClass={spinPartClassNameObj?.inviteRewardClass}
                inviteIsMoneyRewardClass={
                  spinPartClassNameObj?.inviteIsMoneyRewardClass
                }
                inviteNotMoneyRewardClass={
                  spinPartClassNameObj?.inviteNotMoneyRewardClass
                }
                rouletteRotateOffset={
                  spinPartClassNameObj?.rouletteRotateOffset
                }
              />

              {/* 金幣圖 */}
              <SpinWheelRewardImages
                rouletteClass={rouletteClass}
                rewardOrder={item.icon}
                className={cx({
                  [`top-[12%] left-[25%] ${cx(
                    spinPartClassNameObj?.rewardImagesClass,
                    spinPartClassNameObj?.inviteRewardImagesClass
                  )}`]: category === 'invite',
                  [`${cx(
                    spinPartClassNameObj?.rewardImagesClass,
                    spinPartClassNameObj?.rechargeRewardImagesClass
                  )}`]: category === 'recharge',
                })}
                rewardImageClass={cx(spinPartClassNameObj?.rewardImageClass)}
              />
            </div>
          );
        })}
      </div>
    );
  }
);

export default SpinWheelSpinPart;
