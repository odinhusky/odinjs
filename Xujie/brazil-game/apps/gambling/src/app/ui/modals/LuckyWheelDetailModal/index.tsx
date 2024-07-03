import React from 'react';
import { renderByUVersion } from '../../utils/renderByUVersion';

// ? Components
import LuckyWheelDetailModalP1 from './env/p1/LuckyWheelDetailModalP1';
import LuckyWheelDetailModalU1 from './env/u1/LuckyWheelDetailModalU1';
import LuckyWheelDetailModalU2 from './env/u2/LuckyWheelDetailModalU2';
import LuckyWheelDetailModalU5 from './env/u5/LuckyWheelDetailModalU5';
import LuckyWheelDetailModalU6 from './env/u6/LuckyWheelDetailModalU6';
import LuckyWheelDetailModalU7 from './env/u7/LuckyWheelDetailModalU7';

export type LuckyWheelDetailModalProps = {
  isShow?: boolean;
  onClose: <T>(arg?: T) => void;
};

export const LuckyWheelDetailModal = (props: LuckyWheelDetailModalProps) => {
  return renderByUVersion(
    {
      p1: <LuckyWheelDetailModalP1 {...props} />,
      u1: <LuckyWheelDetailModalU1 {...props} />,
      u2: <LuckyWheelDetailModalU2 {...props} />,
      u5: <LuckyWheelDetailModalU5 {...props} />,
      u6: <LuckyWheelDetailModalU6 {...props} />,
      u7: <LuckyWheelDetailModalU7 {...props} />,
    },
    <LuckyWheelDetailModalU1 {...props} />
  );
};

export default LuckyWheelDetailModal;
