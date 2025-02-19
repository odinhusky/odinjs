import { FixPartClassNameObj } from './components/SpinWheelFixdPart';
import { SpinWheelSpinPartClassNameObj } from './components/SpinWheelSpinPart';
import { forwardRef } from 'react';
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
    return <div ref={ref}></div>;
  }
);

export default SpinWheel;
