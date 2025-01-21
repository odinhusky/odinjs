import { useDeepEffect } from '@commonUtils/hooks';
import { useMode2ActivitySwitchPageStore } from '@mode2/zustand/page/activityPageStore';

import useActivityPageActions from '@mode2/action/activityPageAction/useActivityPageActions';
import { handleSwitchTabClick } from '@mode2/action/activityPageAction/actionType';
import { ActivityPageTabType } from '@mode2/@types/activityPageTabType';

export const useMode2ActivityPageSwitchPage = () => {
  const { handleActivityPageClick } = useActivityPageActions();

  const pageIdx = useMode2ActivitySwitchPageStore((state) => state.pageIdx);
  const setSwitchList = useMode2ActivitySwitchPageStore(
    (state) => state.setSwitchList
  );

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
