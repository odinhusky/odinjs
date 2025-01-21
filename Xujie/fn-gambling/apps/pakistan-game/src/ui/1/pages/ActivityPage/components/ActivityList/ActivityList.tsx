import { cx, useBreakPoint } from '@libs/commonUtils';
import { useMode2ActivityListStore } from '@mode2/zustand/page/activityPageStore';
import ActivityBannerImage from '@libs/components/ActivityBannerImage';

export const ActivityList = () => {
  const activityList = useMode2ActivityListStore((state) => state.activityList);

  const { isMobile } = useBreakPoint();
  const length = 8 - activityList.length;

  const aspectClass = 'aspect-[2.2015209]'; // 597x263

  return (
    <div
      className={cx(
        'grid grid-cols-1 gap-3',
        'flex-col justify-center items-center',
        'mt-2.5 mobile:mt-5',
        'mobile:grid-cols-2 mobile:gap-x-4',
        'tablet:gap-5'
      )}
    >
      {activityList.map((item, index) => (
        <ActivityBannerImage key={index} {...item} className="rounded-xl" />
      ))}

      {!isMobile &&
        [...Array(length)].map((_, index) => {
          return (
            <div
              key={index + activityList.length}
              className={cx(
                'rounded-xl bgi-[var(--grayscale-20)]',
                aspectClass
              )}
            ></div>
          );
        })}
    </div>
  );
};

export default ActivityList;
