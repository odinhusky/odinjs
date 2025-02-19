import VipGroup from './components/VipGroup';
import ActivityList from './components/ActivityList/ActivityList';
import { useMode2ActivitySwitchPageStore } from '@mode2/zustand/page/activityPageStore';
import { ActivityPageTabType } from '@mode2/@types/activityPageTabType';
import { cx } from '@libs/commonUtils';
import useActivityPageBase from '@libs/mode2/usecase/page/activityPage/useActivityPageBase';
import useActivityPageHeaderSettingOverride from '@libs/mode2/usecase/page/activityPage/useActivityPageHeaderSettingOverride';
import { MyBonusModal } from './components/MyBonus';

const ActivityPage = () => {
  // $ init
  useActivityPageBase();
  useActivityPageHeaderSettingOverride();

  const pageIdx = useMode2ActivitySwitchPageStore((state) => state.pageIdx);

  return (
    <>
      <div
        className={cx(
          'activity',
          'bg-fixed',
          'w-auto',
          'overflow-scroll',
          'relative -translate-x-2/4 pb-[10px] left-2/4'
        )}
      >
        {pageIdx === ActivityPageTabType.ACTIVITY && <ActivityList />}

        {pageIdx === ActivityPageTabType.VIP && <VipGroup />}
      </div>

      {/* TODO Ronan 新增的模塊 暫時用modal */}
      <MyBonusModal />
    </>
  );
};
export default ActivityPage;
