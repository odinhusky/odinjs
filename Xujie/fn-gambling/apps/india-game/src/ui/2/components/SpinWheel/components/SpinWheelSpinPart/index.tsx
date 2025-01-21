import { cx } from '@libs/commonUtils';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { forwardRef } from 'react';
import SpinWheelRewardImages from '../SpinWheelRewardImages';
import { WheelCategory } from '@components/SpinWheel';
import {
  WheelSegmentCategoryResult,
  WheelSegmentResult,
} from '@libs/mode2/external/api/endpoint/wheel/PostWheelConfigEndpoint';
import { rechargeWheelLevelTypeMapping } from '@libs/mode2/@types/rechargeWheelLevelTypes';
import { capitalize } from 'lodash';
import SpinWheelRewardText from '../SpinWheelRewardText';
import { FixPartClassNameObj } from '@components/SpinWheel/components/SpinWheelFixdPart';

export interface SpinWheelSpinPartClassNameObj {
  container?: string;
  surface?: string;
  rewardTitleClass?: string;
  rewardImageClass?: string;
}

interface SpinWheelSpinPartProps {
  category: WheelCategory;
  wheelBgImgName: string;
  wheelSegments: WheelSegmentResult[];
  spinPartClassNameObj?: SpinWheelSpinPartClassNameObj;
  rouletteClass: string;
}

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
                transform: `rotate(${45 * index}deg)`,
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
              />

              {/* 金幣圖 */}
              <SpinWheelRewardImages
                rouletteClass={rouletteClass}
                rewardOrder={item.icon}
                className={cx({
                  'top-[12%] left-[25%]': category === 'invite',
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
