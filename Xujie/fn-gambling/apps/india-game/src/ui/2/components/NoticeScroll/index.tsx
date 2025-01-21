import {
  useMode2HallPageRefsStore,
  useMode2MarqueeActionsStore,
  useMode2MarqueeListStore,
} from '@mode2/zustand/page/hallPageStore';
import MarqueeScroll from '@components/MarqueeScroll';

export const NoticeScroll = () => {
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
      marqueeUnitStyle={{ color: fontColor }}
      hasDefaultStyle={false}
    />
  );
};

export default NoticeScroll;
