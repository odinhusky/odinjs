import { cx } from '@libs/commonUtils';
import { FLEX_CENTER } from '@libs/constant/style';
import SpinWheelFixedPart, {
  FixPartClassNameObj,
} from './components/SpinWheelFixdPart';
import SpinWheelSpinPart, {
  SpinWheelSpinPartClassNameObj,
} from './components/SpinWheelSpinPart';
import { forwardRef } from 'react';
import {
  inviteRouletteClass,
  rechargeRouletteClass,
} from '@components/SpinWheel/rouletteStyle';
import { RechargeWheelType } from '@libs/mode2/zustand/components/rechargeWheelTabStore';
import { WheelSegmentResult } from '@libs/mode2/external/api/endpoint/wheel/PostWheelConfigEndpoint';

export type WheelCategory = 'recharge' | 'invite';

interface SpinWheelProps {
  category: WheelCategory;
  type?: RechargeWheelType;
  isAnimating: boolean;
  handleClickTrigger: VoidFunction;
  className?: string;
  spinPartClassNameObj?: SpinWheelSpinPartClassNameObj;
  fixPartClassNameObj?: FixPartClassNameObj;
  wheelSegments: WheelSegmentResult[];
  remainSpin?: number;
  remindFreeSpin?: number;
}

export const SpinWheel = forwardRef<HTMLDivElement, SpinWheelProps>(
  (
    {
      category = 'recharge',
      type,
      isAnimating,
      handleClickTrigger,
      className,
      spinPartClassNameObj,
      fixPartClassNameObj,
      wheelSegments,
      remainSpin = 0,
      remindFreeSpin = 0,
    },
    ref
  ) => {
    const defaultButtonInfo = { remainSpin: remindFreeSpin + remainSpin };

    const diffButtonInfo =
      category === 'recharge'
        ? { buttonType: type }
        : { isFreeSpin: !!remindFreeSpin };

    const buttonInfo = {
      ...defaultButtonInfo,
      ...diffButtonInfo,
    };

    const prefix = category === 'invite' ? category : type;
    const rouletteClass =
      category === 'recharge' ? rechargeRouletteClass : inviteRouletteClass;

    return (
      <div
        className={cx(
          rouletteClass,
          FLEX_CENTER,
          'relative',
          'z-[5]',
          className
        )}
      >
        <SpinWheelSpinPart
          ref={ref}
          category={category}
          wheelBgImgName={`${prefix}_wheel_surface`}
          spinPartClassNameObj={spinPartClassNameObj}
          wheelSegments={wheelSegments}
          rouletteClass={rouletteClass}
        />

        <SpinWheelFixedPart
          category={category}
          imgNames={{
            frame: `${prefix}_wheel_frame`,
            button: `${prefix}_wheel_button`,
          }}
          isAnimating={isAnimating}
          buttonInfo={buttonInfo}
          onClickTrigger={handleClickTrigger}
          rouletteClass={rouletteClass}
          fixPartClassNameObj={fixPartClassNameObj}
        />
      </div>
    );
  }
);

export default SpinWheel;
