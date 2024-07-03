import { useState } from 'react';
import { renderByUVersion } from '../../../utils/renderByUVersion';

import LuckyWheelP1 from './env/p1/LuckyWheelP1';
import LuckyWheelU1 from './env/u1/LuckyWheelU1';
import LuckyWheelU2 from './env/u2/LuckyWheelU2';
import LuckyWheelU5 from './env/u5/LuckyWheelU5';
import LuckyWheelU6 from './env/u6/LuckyWheelU6';
import LuckyWheelU7 from './env/u7/LuckyWheelU7';

import { IsAnimatingObjInterface } from './luckyWheelTypes';
import { LuckyWheelCtxProvider } from './LuckyWheelContext';

interface LuckyWheelProps {}

export const LuckyWheel = (props: LuckyWheelProps) => {
  // 防止連點
  const [isAnimatingObj, setIsAnimatingObj] = useState<IsAnimatingObjInterface>(
    {
      Silver: false,
      Gold: false,
      Diamond: false,
    }
  );

  const luckyWheelCtxValue = {
    isAnimatingObj,
    setIsAnimatingObj,
  };

  return (
    <>
      <LuckyWheelCtxProvider value={luckyWheelCtxValue}>
        {renderByUVersion(
          {
            p1: <LuckyWheelP1 />,
            u1: <LuckyWheelU1 />,
            u2: <LuckyWheelU2 />,
            u5: <LuckyWheelU5 />,
            u6: <LuckyWheelU6 />,
            u7: <LuckyWheelU7 />,
          },
          <LuckyWheelU1 />
        )}
      </LuckyWheelCtxProvider>
    </>
  );
};

export default LuckyWheel;
