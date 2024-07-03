import React from 'react';
import { renderByUVersion } from '../../utils/renderByUVersion';

// ? Components
import LuckyWheelLuckyValueInsufficientModalP1 from './env/p1/LuckyWheelLuckyValueInsufficientModalP1';
import LuckyWheelLuckyValueInsufficientModalU1 from './env/u1/LuckyWheelLuckyValueInsufficientModalU1';
import LuckyWheelLuckyValueInsufficientModalU2 from './env/u2/LuckyWheelLuckyValueInsufficientModalU2';
import LuckyWheelLuckyValueInsufficientModalU5 from './env/u5/LuckyWheelLuckyValueInsufficientModalU5';
import LuckyWheelLuckyValueInsufficientModalU6 from './env/u6/LuckyWheelLuckyValueInsufficientModalU6';
import LuckyWheelLuckyValueInsufficientModalU7 from './env/u7/LuckyWheelLuckyValueInsufficientModalU7';

export type LuckyWheelLuckyValueInsufficientModalProps = {
  isShow: boolean;
  onClose: <T>(arg?: T) => void;
};

export const LuckyWheelLuckyValueInsufficientModal = (
  props: LuckyWheelLuckyValueInsufficientModalProps
) => {
  return renderByUVersion(
    {
      p1: <LuckyWheelLuckyValueInsufficientModalP1 {...props} />,
      u1: <LuckyWheelLuckyValueInsufficientModalU1 {...props} />,
      u2: <LuckyWheelLuckyValueInsufficientModalU2 {...props} />,
      u5: <LuckyWheelLuckyValueInsufficientModalU5 {...props} />,
      u6: <LuckyWheelLuckyValueInsufficientModalU6 {...props} />,
      u7: <LuckyWheelLuckyValueInsufficientModalU7 {...props} />,
    },
    <></>
  );
};

export default LuckyWheelLuckyValueInsufficientModal;
