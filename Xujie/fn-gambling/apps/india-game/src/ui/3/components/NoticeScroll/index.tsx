import {
  useMode2HallPageRefsStore,
  useMode2MarqueeActionsStore,
  useMode2MarqueeListStore,
} from '@mode2/zustand/page/hallPageStore';
import MarqueeScrollVertical from '@components/MarqueeScrollVertical';

export const NoticeScroll = () => {
  const marqueeList = useMode2MarqueeListStore((state) => state.marqueeList);
  const marqueeActionList = useMode2MarqueeActionsStore(
    (state) => state.marqueeActionList
  );

  const scrollContainerRef = useMode2HallPageRefsStore(
    (state) => state.scrollContainerRef
  );

  const mixMarqueeList = marqueeList.map((item, index) => ({
    id: `${item.type}`,
    broadcastText: item.broadcastText,
    action: marqueeActionList[index],
  }));

  return (
    <MarqueeScrollVertical
      ref={scrollContainerRef}
      marqueeList={mixMarqueeList}
      marqueeUnitStyle={{ color: 'var(--grayscale-100)' }}
    />
  );
};

export default NoticeScroll;
