import {
  useMode2HallPageRefsStore,
  useMode2MarqueeActionsStore,
  useMode2MarqueeListStore,
} from '@mode2/zustand/page/hallPageStore';
import { cx } from '@libs/commonUtils';
import Icon from '@libs/mode2/components/Icon';
import Marquee from 'react-fast-marquee';

export const NoticeScroll = ({ className }: { className?: string }) => {
  const marqueeList = useMode2MarqueeListStore((state) => state.marqueeList);
  const marqueeActionList = useMode2MarqueeActionsStore(
    (state) => state.marqueeActionList
  );

  const scrollContainerRef = useMode2HallPageRefsStore(
    (state) => state.scrollContainerRef
  );

  const fontColor = useMode2MarqueeListStore((state) => state.fontColor);

  return (
    <div className={cx('flex items-center', className)}>
      <Icon
        className="w-4 h-4 mr-2"
        name="ic_volume"
        color="var(--state-success-main)"
      />

      <div
        className={cx('overflow-hidden', 'whitespace-nowrap', 'w-full')}
        ref={scrollContainerRef}
      >
        <Marquee speed={30} autoFill={true}>
          {marqueeList.map((item, index) => {
            return (
              <div
                className={cx(
                  'scroll-item',
                  'inline-block',
                  'text-sm leading-[30px]',
                  'h-[30px]',
                  'pr-5',
                  'transition-colors',
                  'duration-1000'
                )}
                key={index}
                style={{ color: fontColor }}
                onClick={() => {
                  marqueeActionList[index]();
                }}
              >
                {item.broadcastText}
              </div>
            );
          })}
        </Marquee>
      </div>
    </div>
  );
};

export default NoticeScroll;
