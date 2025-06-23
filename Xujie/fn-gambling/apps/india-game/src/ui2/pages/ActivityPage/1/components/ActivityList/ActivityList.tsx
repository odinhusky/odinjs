import { cx } from '@libs/commonUtils';
import { useMode2ActivityListStore } from '@mode2/zustand/page/activityPageStore';
import ActivityBannerImage from '@libs/components/ActivityBannerImage';

export const ActivityList = () => {
  const activityList = useMode2ActivityListStore((state) => state.activityList);

  return (
    <div
      className={cx(
        'grid mobile:grid-cols-2 grid-cols-1 gap-5',
        'flex-col justify-center items-center',
        'mt-2.5 mobile:mt-5',
        {
          'mobile:grid-rows-4': activityList.length < 8,
        }
      )}
    >
      {activityList.map((item, index) => {
        return <ActivityBannerImage key={index} {...item} />;
      })}

      {activityList.length < 8
        ? new Array(Math.abs(activityList.length - 8))
            .fill(0)
            .map((d, index) => {
              return (
                <div className="w-full h-full max-w-[590px] max-h-[274px] bgi-[var(--grayscale-20)] rounded-lg" />
              );
            })
        : null}
    </div>
  );
};

export default ActivityList;
