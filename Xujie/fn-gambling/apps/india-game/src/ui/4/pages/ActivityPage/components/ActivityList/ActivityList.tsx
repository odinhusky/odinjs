import { cx } from '@libs/commonUtils';
import { useMode2ActivityListStore } from '@mode2/zustand/page/activityPageStore';
import ActivityBannerImage from '@libs/components/ActivityBannerImage';

export const ActivityList = () => {
  const activityList = useMode2ActivityListStore((state) => state.activityList);
  return (
    <div className={cx('grid gap-4', 'mt-2')}>
      {activityList.map((item, index) => {
        return (
          <div
            className={cx(
              '',
              'rounded-md',
              'bgi-border-[var(--base-1-variant1)] cursor-pointer'
            )}
          >
            <ActivityBannerImage
              key={index}
              {...item}
              className="rounded-none z-10 relative"
            />
            <div
              className={cx(
                'text-sm font-medium py-2 ml-3 box-border',
                'bgi-[var(--base-2-variant11)] bgi-text-[var(--grayscale-100)]'
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

export default ActivityList;
