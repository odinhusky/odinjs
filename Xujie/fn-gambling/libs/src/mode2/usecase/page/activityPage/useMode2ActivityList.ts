import { useMode2ActivityListStore } from '@mode2/zustand/page/activityPageStore';
import { useDeepEffect } from '@libs/commonUtils';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { AnnouncementType } from '@mode2/@types/announcementType';

export const useMode2ActivityList = () => {
  // const [postAnnouncementInfo, { data: activityList }] =
  //   usePostAnnouncementInfoMutation();
  const isFirstDeposit = useUserProfileStore((state) => state.isFirstDeposit);

  // const setOriginalActivityList = useMode2ActivityListStore(
  //   (state) => state.setOriginalActivityList
  // );

  const originalActivityList = useMode2ActivityListStore(
    (state) => state.originalActivityList
  );
  const setActivityList = useMode2ActivityListStore(
    (state) => state.setActivityList
  );

  // 因為用 post 拿資料所以不得不 trigger 一次
  // useEffect(() => {
  //   postAnnouncementInfo();
  // }, []);

  // useDeepEffect(() => {
  //   if (!activityList) return;
  //   const result = activityList.map((item) => ({ ...item }));
  //   setOriginalActivityList(result);
  // }, [activityList]);

  useDeepEffect(() => {
    const items = originalActivityList.filter((item) => {
      return (
        item.type !=
        (isFirstDeposit
          ? AnnouncementType.RECHARGING
          : AnnouncementType.FIRST_CHARGE)
      );
    });
    setActivityList(items);
  }, [originalActivityList, isFirstDeposit]);
};

export default useMode2ActivityList;
