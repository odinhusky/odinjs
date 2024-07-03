import { ReactNode } from 'react';
import { renderByUVersion } from '../../../../utils/renderByUVersion';

import LuckyWheelBtnP1 from '../env/p1/LuckyWheelBtnP1';
import LuckyWheelBtnU1 from '../env/u1/LuckyWheelBtnU1';
import LuckyWheelBtnU2 from '../env/u2/LuckyWheelBtnU2';
import LuckyWheelBtnU5 from '../env/u5/LuckyWheelBtnU5';
import LuckyWheelBtnU6 from '../env/u6/LuckyWheelBtnU6';
import LuckyWheelBtnU7 from '../env/u7/LuckyWheelBtnU7';

export type LuckyWheelBtnProps = {
  isDisabled?: boolean;
  children?: ReactNode;
  onClick?: <T>(arg?: T) => void;
  className?: string;
};

export const LuckyWheelBtn = (props: LuckyWheelBtnProps) => {
  return renderByUVersion(
    {
      p1: <LuckyWheelBtnP1 {...props} />,
      u1: <LuckyWheelBtnU1 {...props} />,
      u2: <LuckyWheelBtnU2 {...props} />,
      u5: <LuckyWheelBtnU5 {...props} />,
      u6: <LuckyWheelBtnU6 {...props} />,
      u7: <LuckyWheelBtnU7 {...props} />,
    },
    <LuckyWheelBtnU1 {...props} />
  );
};

export default LuckyWheelBtn;
