import { renderByUVersion } from '../../../../utils/renderByUVersion';

import LuckyWheelRewardAmountU1 from '../env/u1/LuckyWheelRewardAmountU1';
import LuckyWheelRewardAmountU5 from '../env/u5/LuckyWheelRewardAmountU5';
import LuckyWheelRewardAmountU6 from '../env/u6/LuckyWheelRewardAmountU6';
import LuckyWheelRewardAmountU7 from '../env/u7/LuckyWheelRewardAmountU7';

export interface LuckyWheelRewardAmountProps {
  showRewardAmount: number;
}

export const LuckyWheelRewardAmount = (props: LuckyWheelRewardAmountProps) => {
  return renderByUVersion(
    {
      p1: <LuckyWheelRewardAmountU1 {...props} />,
      u1: <LuckyWheelRewardAmountU1 {...props} />,
      u2: <LuckyWheelRewardAmountU1 {...props} />,
      u5: <LuckyWheelRewardAmountU5 {...props} />,
      u6: <LuckyWheelRewardAmountU6 {...props} />,
      u7: <LuckyWheelRewardAmountU7 {...props} />,
    },
    <LuckyWheelRewardAmountU1 {...props} />
  );
};

export default LuckyWheelRewardAmount;
