import MarqueeScroll from '@components/MarqueeScroll';
import {
  useMode2HallPageRefsStore,
  useMode2MarqueeActionsStore,
  useMode2MarqueeListStore,
} from '@mode2/zustand/page/hallPageStore';
import { NoticeScrollProps } from '../NoticeScrollProps';

export const NoticeScroll = (props?: NoticeScrollProps) => {
  const marqueeList = useMode2MarqueeListStore((state) => state.marqueeList);
  const marqueeActionList = useMode2MarqueeActionsStore(
    (state) => state.marqueeActionList
  );

  const scrollContainerRef = useMode2HallPageRefsStore(
    (state) => state.scrollContainerRef
  );

  const fontColor = useMode2MarqueeListStore((state) => state.fontColor);

  const mixMarqueeList = marqueeList.map((item, index) => ({
    id: `${item.type}`,
    broadcastText: item.broadcastText,
    action: marqueeActionList[index],
  }));

  return (
    <MarqueeScroll
      ref={scrollContainerRef}
      marqueeList={mixMarqueeList}
      marqueeUnitStyle={{
        color: props?.fromPropsFontColor ? props.fromPropsFontColor : fontColor,
      }}
      hasDefaultStyle={false}
    />
  );
};

export default NoticeScroll;
