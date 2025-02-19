import { forwardRef } from 'react';
import { WheelCategory } from '@components/SpinWheel';
import { WheelSegmentResult } from '@libs/mode2/external/api/endpoint/wheel/PostWheelConfigEndpoint';

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
    return <div ref={ref}></div>;
  }
);

export default SpinWheelSpinPart;
