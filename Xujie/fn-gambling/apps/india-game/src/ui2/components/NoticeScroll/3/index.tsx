import MarqueeScrollVertical from '@components/MarqueeScrollVertical';
import {
  BroadcastItem,
  useMode2HallPageRefsStore,
  useMode2MarqueeListStore,
} from '@mode2/zustand/page/hallPageStore';
import { NoticeScrollProps } from '../NoticeScrollProps';

const SLICED_SIZE = 60;

export const NoticeScroll = (props?: NoticeScrollProps) => {
  const marqueeList = useMode2MarqueeListStore((state) => state.marqueeList);

  // 自然斷行
  // 盡量優雅在空白切；
  // trimStart() 避免重複出現空白；
  // 保留中文內容、符號與非空白處理。
  const result: BroadcastItem[] = marqueeList.flatMap((item) => {
    const text = item.broadcastText || '';
    if (text.length <= SLICED_SIZE) {
      return [item];
    }

    const parts: BroadcastItem[] = [];
    let remaining = text;

    while (remaining.length > 0) {
      if (remaining.length <= SLICED_SIZE) {
        parts.push({
          type: item.type,
          broadcastText: remaining,
        });
        break;
      }

      // 嘗試在前 SLICED_SIZE 個字內找最後一個空白
      const slice = remaining.slice(0, SLICED_SIZE);
      let lastSpaceIndex = slice.lastIndexOf(' ');

      if (lastSpaceIndex === -1) {
        // 沒空白就硬切
        lastSpaceIndex = SLICED_SIZE;
      }

      parts.push({
        type: item.type,
        broadcastText: slice.slice(0, lastSpaceIndex),
      });

      // 移除已處理部分，注意若有空白也一併跳過
      remaining = remaining.slice(lastSpaceIndex).trimStart();
    }
    return parts;
  });

  const scrollContainerRef = useMode2HallPageRefsStore(
    (state) => state.scrollContainerRef
  );

  const mixMarqueeList = result.map((item, index) => ({
    id: `${item.type}`,
    broadcastText: item.broadcastText,
    action: () => {},
    // action: marqueeActionList[index], // Evan  確認AA無行為
  }));

  return (
    <MarqueeScrollVertical
      ref={scrollContainerRef}
      marqueeList={mixMarqueeList}
      marqueeUnitStyle={{ color: 'var(--grayscale-100)' }}
      autoplayDelay={5000}
    />
  );
};

export default NoticeScroll;
