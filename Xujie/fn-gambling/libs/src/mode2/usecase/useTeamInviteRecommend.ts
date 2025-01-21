import { useEffect } from 'react';
import { isEmpty } from 'lodash';
import dayjs from 'dayjs';
import { usePostPromoteHomeMutation } from '@mode2API/index';
import { useIsLoginStore } from '@mode2/zustand/loginStore';
import sdkUtils from '@mode2/utils/sdk';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import { useDeepEffect } from '@libs/commonUtils';
import { useMode2TeamClubPageShareForBonusStore } from '@mode2/zustand/page/teamClubPageStore';
import { useMode2InviteEarnStore } from '@mode2/zustand/page/invitePageStore';

export const useTeamInviteRecommend = () => {
  const fetchInterval = 1000 * 60; // 預設 1 分鐘
  const [postPromoteHome, { data: promoteHomeData }] =
    usePostPromoteHomeMutation();

  const isLogin = useIsLoginStore((state) => state.isLogin);
  const lastFetchTime = useMode2TeamClubPageShareForBonusStore(
    (state) => state.lastFetchTime
  );
  const setReferralInfo = useMode2InviteEarnStore(
    (state) => state.setReferralInfo
  );
  const setLastFetchTime = useMode2TeamClubPageShareForBonusStore(
    (state) => state.setLastFetchTime
  );
  useDeepEffect(() => {
    if (dayjs().valueOf() >= fetchInterval + lastFetchTime && isLogin) {
      postPromoteHome();
    }
  }, [lastFetchTime, isLogin]);

  useEffect(() => {
    if (promoteHomeData) {
      setLastFetchTime(dayjs().valueOf());
      setReferralInfo(promoteHomeData.referralInfo);
    }
  }, [promoteHomeData]);

  // 不可以  deps[isLogin]， 會造成多次觸發， 直接拿 token 判斷
  const fetchNow = () => {
    const token = sdkUtils.getStorage(AppLocalStorageKey.TOKEN);
    if (!isEmpty(token)) {
      postPromoteHome();
    }
  };

  return { fetchNow: fetchNow };
};
