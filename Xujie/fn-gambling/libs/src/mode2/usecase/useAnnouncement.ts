import { usePostAnnouncementInfoMutation } from '@mode2API/index';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { useEffect } from 'react';
import { useMode2ActivityListStore } from '@mode2/zustand/page/activityPageStore';
import { usePlatformNotifyStore } from '@mode2/zustand/platform/platformNotifyStore';
import { UserRoleType } from '@mode2/@types/userRoleTypes';

export const useAnnouncement = () => {
  const [postAnnouncementInfo, { data, isSuccess }] =
    usePostAnnouncementInfoMutation();

  const userRole = useUserProfileStore((state) => state.userRole);

  const setOriginalActivityList = useMode2ActivityListStore(
    (state) => state.setOriginalActivityList
  );

  const setAnnouncementsItems = usePlatformNotifyStore(
    (state) => state.setAnnouncementsItems
  );

  const setHallPopupAnnouncementsItems = usePlatformNotifyStore(
    (state) => state.setHallPopupAnnouncementsItems
  );

  useEffect(() => {
    setHallPopupAnnouncementsItems([]);
    postAnnouncementInfo();
  }, [userRole]);

  useEffect(() => {
    if (data && isSuccess) {
      setOriginalActivityList(data.activityAnnouncements);
      setAnnouncementsItems(data.homeAnnouncements);
      setHallPopupAnnouncementsItems(data.hallPopupAnnouncements);
    }
  }, [data, isSuccess]);
};
