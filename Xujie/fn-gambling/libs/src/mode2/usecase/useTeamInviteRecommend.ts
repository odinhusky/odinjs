import { useMode2InviteEarnStore } from '@mode2/zustand/page/invitePageStore';

export const useTeamInviteRecommend = () => {
  // const fetchInterval = 1000 * 60; // 預設 1 分鐘
  // const [postPromoteHome, { data: promoteHomeData }] =
  //   usePostPromoteHomeMutation();

  const refreshPromoteHomeData = useMode2InviteEarnStore(
    (state) => state.refreshPromoteHomeData
  );
  // const promoteHomeData = useMode2InviteEarnStore(
  //   (state) => state.promoteHomeData
  // );
  // const isLogin = useIsLoginStore((state) => state.isLogin);
  // const lastFetchTime = useMode2TeamClubPageShareForBonusStore(
  //   (state) => state.lastFetchTime
  // );
  // const setReferralInfo = useMode2InviteEarnStore(
  //   (state) => state.setReferralInfo
  // );
  // const setLastFetchTime = useMode2TeamClubPageShareForBonusStore(
  //   (state) => state.setLastFetchTime
  // );

  // useDeepEffect(() => {
  //   if (dayjs().valueOf() >= fetchInterval + lastFetchTime && isLogin) {
  //     postPromoteHome();
  //   }
  // }, [lastFetchTime, isLogin]);

  // useEffect(() => {
  //   if (promoteHomeData) {
  //     setLastFetchTime(dayjs().valueOf());
  //     setReferralInfo(promoteHomeData.referralInfo);
  //   }
  // }, [promoteHomeData]);

  // 不可以  deps[isLogin]， 會造成多次觸發， 直接拿 token 判斷
  const fetchNow = () => {
    refreshPromoteHomeData();
  };

  return { fetchNow: fetchNow };
};
