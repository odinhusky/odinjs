import { forwardRef } from 'react';
import { SpinWheelProps } from './SpinWheelProps';

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
