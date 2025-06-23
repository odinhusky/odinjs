import { useMode2ActivityListStore } from '@mode2/zustand/page/activityPageStore';
import { cx } from '@libs/commonUtils';
import useActivityPageBase from '@libs/mode2/usecase/page/activityPage/useActivityPageBase';
import ActivityBannerImage from '@libs/components/ActivityBannerImage';

export const ActivityPage = () => {
  // $ init
  useActivityPageBase();

  const activityList = useMode2ActivityListStore((state) => state.activityList);

  return (
    <div className={cx('grid gap-4', 'mt-2')}>
      {activityList.map((item, index) => {
        return (
          <div
            key={`ActivityItem - ${item.title} - ${item.type} - ${item.linkUrl} - ${index}`}
            className={cx(
              'relative flex flex-col justify-center',
              'rounded-lg',
              'bgi-border-2-[var(--base-1-variant1)] cursor-pointer'
            )}
          >
            <ActivityBannerImage
              key={index}
              {...item}
              aspectClass={'aspect-[2.113207547169811]'}
              className="rounded-t-lg z-10 w-full h-full "
            />

            <div
              className={cx(
                'w-full',
                'text-base font-medium py-[15px] pl-3 box-border',
                'absolute bottom-0 left-0 z-10',
                'bgi-text-[var(--grayscale-100)] bgi-[var(--base-2-variant11)] rounded-b-lg'
              )}
            >
              {item.title}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default ActivityPage;
