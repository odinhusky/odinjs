import { usePlatformNotifyStore } from '@mode2/zustand/platform/platformNotifyStore';
import {
  AnnouncementItem,
  useMode2BannerActionsStore,
  useMode2BannerStore,
} from '@mode2/zustand/page/hallPageStore';
import { cloneDeep, isArray, isEmpty, isNil } from 'lodash';
import { AnnouncementResult } from '@mode2API/endpoint/user/PostHomeEndpoint';
import { handleBannerClickSwipe } from '@mode2/action/hallPageAction/actionType';
import useHallPageActions from '@mode2/action/hallPageAction/useHallPageActions';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { AnnouncementType } from '@mode2/@types/announcementType';
import { useDeepEffect } from '@libs/commonUtils';

export const useBannerListBase = () => {
  const announcementsItems = usePlatformNotifyStore(
    (state) => state.announcementsItems
  );
  const isFirstDeposit = useUserProfileStore((state) => state.isFirstDeposit);
  const setBannerList = useMode2BannerStore((state) => state.setBannerList);
  const setBannerActionList = useMode2BannerActionsStore(
    (state) => state.setBannerActionList
  );

  const { handleHallPageClick } = useHallPageActions();

  useDeepEffect(() => {
    if (isNil(announcementsItems)) return;

    let list: AnnouncementItem[] = [];
    let actionList: (() => void)[] = [];

    if (
      announcementsItems &&
      isArray(announcementsItems) &&
      !isEmpty(announcementsItems)
    ) {
      const cloneBannerList = announcementsItems
        .filter((item) => {
          return (
            item.type !=
            (isFirstDeposit
              ? AnnouncementType.RECHARGING
              : AnnouncementType.FIRST_CHARGE)
          );
        })
        .map((item: AnnouncementResult) => {
          return {
            ...cloneDeep(item),
          };
        });

      list = cloneBannerList;

      actionList = cloneBannerList.map((item) => () => {
        handleHallPageClick({
          actionName: handleBannerClickSwipe,
          payload: {
            item,
          },
        });
      });
    }

    setBannerList(list);
    setBannerActionList(actionList);
  }, [announcementsItems, isFirstDeposit]);
};

export default useBannerListBase;
