import { forwardRef } from 'react';
import { SpinWheelSpinPartProps } from '@components/SpinWheel/SpinWheelProps';

export const SpinWheelSpinPart = forwardRef<
  HTMLDivElement,
  SpinWheelSpinPartProps
>((props, ref) => {
  return <div ref={ref}></div>;
});

export default SpinWheelSpinPart;
