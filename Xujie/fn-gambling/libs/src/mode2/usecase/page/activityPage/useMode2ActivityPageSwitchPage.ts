import { useDeepEffect } from '@commonUtils/hooks';
import { useMode2ActivitySwitchPageStore } from '@mode2/zustand/page/activityPageStore';

import useActivityPageActions from '@mode2/action/activityPageAction/useActivityPageActions';
import { handleSwitchTabClick } from '@mode2/action/actionTypes';
import { ActivityPageTabType } from '@mode2/@types/activityPageTabType';
import { useStayTracker } from '@libs/commonUtils/stayTracker/useStayTracker';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';

export const useMode2ActivityPageSwitchPage = () => {
  const { handleActivityPageClick } = useActivityPageActions();

  const pageIdx = useMode2ActivitySwitchPageStore((state) => state.pageIdx);
  const setSwitchList = useMode2ActivitySwitchPageStore(
    (state) => state.setSwitchList
  );

  useStayTracker({
    page: BasePagePathObj.TeamClubPage,
    tab: pageIdx,
  });

  useDeepEffect(() => {
    const switchList = [
      {
        id: 'switch-1',
        isActive: pageIdx === ActivityPageTabType.ACTIVITY,
        i18n: { i18nKey: 'leftnav_activity' },
        action: () => {
          handleActivityPageClick({
            actionName: handleSwitchTabClick,
            payload: {
              idx: ActivityPageTabType.ACTIVITY,
            },
          });
        },
      },
      {
        id: 'switch-2',
        isActive: pageIdx === ActivityPageTabType.VIP,
        i18n: { i18nKey: 'leftnav_vip' },
        action: () => {
          handleActivityPageClick({
            actionName: handleSwitchTabClick,
            payload: {
              idx: ActivityPageTabType.VIP,
            },
          });
        },
      },
    ];

    setSwitchList(switchList);
  }, [pageIdx]);
};
export default useMode2ActivityPageSwitchPage;
