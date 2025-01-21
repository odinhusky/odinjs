import MarqueeScroll from '@components/MarqueeScroll';
import { useRechargeWheelScrollStore } from '@libs/mode2/zustand/components/rechargeWheelScrollStore';

import useRechargeWheelScrollBase from '@mode2/usecase/components/useRechargeWheelScrollBase';

interface RechargeWheelScrollProps {}

export const RechargeWheelScroll = ({}: RechargeWheelScrollProps) => {
  useRechargeWheelScrollBase();

  const newsTickerMarqueeList = useRechargeWheelScrollStore(
    (state) => state.newsTickerMarqueeList
  );

  return <MarqueeScroll marqueeList={newsTickerMarqueeList} />;
};

export default RechargeWheelScroll;
