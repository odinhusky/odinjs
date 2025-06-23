import './index.scss';
import BackNavigate from '@components/BackNavigate';

import VipGroup from './components/VipGroup';
import ActivityPageSwitchBar from './components/ActivityPageSwitchBar/ActivityPageSwitchBar';
import useActivityPageBase from '@libs/mode2/usecase/page/activityPage/useActivityPageBase';
import ActivityList from './components/ActivityList/ActivityList';
import { useMode2ActivitySwitchPageStore } from '@mode2/zustand/page/activityPageStore';
import { ActivityPageTabType } from '@mode2/@types/activityPageTabType';
import { cx } from '@libs/commonUtils';
import { useStayTracker } from '@libs/commonUtils/stayTracker/useStayTracker';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';

export const ActivityPage = () => {
  // $ init
  useActivityPageBase();

  const pageIdx = useMode2ActivitySwitchPageStore((state) => state.pageIdx);
  useStayTracker({
    page: BasePagePathObj.TeamClubPage,
    tab: pageIdx,
  });

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
      <BackNavigate className={'mt-8'} />

      <ActivityPageSwitchBar />

      {pageIdx === ActivityPageTabType.ACTIVITY && <ActivityList />}

      {pageIdx === ActivityPageTabType.VIP && <VipGroup />}
    </div>
  );
};
export default ActivityPage;
