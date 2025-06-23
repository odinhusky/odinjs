// import MarqueeScroll from '@components/MarqueeScroll';
import MarqueeScrollVertical from '@components/MarqueeScrollVertical';
import { cx } from '@libs/commonUtils';
import { FLEX_CENTER } from '@libs/constant/style';
import { useRechargeWheelScrollStore } from '@libs/mode2/zustand/components/rechargeWheelScrollStore';

import useRechargeWheelScrollBase from '@mode2/usecase/components/useRechargeWheelScrollBase';

interface RechargeWheelScrollProps {}

export const RechargeWheelScroll = (props: RechargeWheelScrollProps) => {
  useRechargeWheelScrollBase();

  const newsTickerMarqueeList = useRechargeWheelScrollStore(
    (state) => state.newsTickerMarqueeList
  );

  return (
    <div className={cx('w-full', FLEX_CENTER)}>
      <MarqueeScrollVertical
        marqueeList={newsTickerMarqueeList}
        containerClass={cx('w-[328px] h-[38px]')}
      />
    </div>
  );
};

export default RechargeWheelScroll;
