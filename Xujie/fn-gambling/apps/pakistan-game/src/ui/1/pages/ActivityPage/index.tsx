import './index.scss';
import BackNavigate from '@components/BackNavigate';

import VipGroup from './components/VipGroup';
import ActivityPageSwitchBar from './components/ActivityPageSwitchBar/ActivityPageSwitchBar';
import useActivityPageBase from '@libs/mode2/usecase/page/activityPage/useActivityPageBase';
import ActivityList from './components/ActivityList/ActivityList';
import { useMode2ActivitySwitchPageStore } from '@mode2/zustand/page/activityPageStore';
import { ActivityPageTabType } from '@mode2/@types/activityPageTabType';
import { cx } from '@libs/commonUtils';

const ActivityPage = () => {
  // $ init
  useActivityPageBase();

  const pageIdx = useMode2ActivitySwitchPageStore((state) => state.pageIdx);

  return (
    <div
      className={cx(
        'activity',
        'bg-fixed',
        'w-auto',
        'min-h-screen max-w-[1200px]',
        'bgi-text-[#fffc]',
        'overflow-scroll',
        'relative -translate-x-2/4 pb-[150px] left-2/4'
      )}
    >
      <BackNavigate className={'mt-8 bgi-text-[var(--grayscale-100)]'} />

      <ActivityPageSwitchBar />

      {pageIdx === ActivityPageTabType.ACTIVITY && <ActivityList />}

      {/* TODO */}
      {pageIdx === ActivityPageTabType.VIP && <VipGroup />}
    </div>
  );
};
export default ActivityPage;
