import { cx } from '@libs/commonUtils';
import { useMode2ActivityListStore } from '@mode2/zustand/page/activityPageStore';
import ActivityBannerImage from '@libs/components/ActivityBannerImage';

export const ActivityList = () => {
  const activityList = useMode2ActivityListStore((state) => state.activityList);
  return (
    <div
      className={cx(
        'grid grid-cols-1 gap-5',
        'flex-col justify-center items-center',
        'mt-2.5',
        'mobile:grid-cols-2 mobile:mt-5'
      )}
    >
      {activityList.map((item, index) => {
        return <ActivityBannerImage key={index} {...item} />;
      })}
    </div>
  );
};

export default ActivityList;
