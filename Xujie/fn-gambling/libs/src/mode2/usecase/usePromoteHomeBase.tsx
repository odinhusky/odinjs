import { usePostPromoteHomeMutation } from '@mode2API/index';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { useUpdateEffect } from '@libs/commonUtils';
import { useIsLoginStore } from '@mode2/zustand/loginStore';
import { useMode2InviteEarnStore } from '@mode2/zustand/page/invitePageStore';

const PROMOTE_HOME_FETCH_INTERVAL = 1000 * 60; // 預設 1 分鐘

export const usePromoteHomeBase = () => {
  const [postPromoteHome, { data, isSuccess }] = usePostPromoteHomeMutation();
  const fetchNumber = useMode2InviteEarnStore((state) => state.fetchNumber);
  const lastFetchTime = useMode2InviteEarnStore((state) => state.lastFetchTime);
  const setPromoteHomeData = useMode2InviteEarnStore(
    (state) => state.setPromoteHomeData
  );

  const setReferralInfo = useMode2InviteEarnStore(
    (state) => state.setReferralInfo
  );

  const isLogin = useIsLoginStore((state) => state.isLogin);

  useUpdateEffect(() => {
    if (
      isLogin &&
      dayjs().valueOf() >= PROMOTE_HOME_FETCH_INTERVAL + lastFetchTime &&
      fetchNumber >= 0
    ) {
      postPromoteHome();
    }
  }, [fetchNumber, isLogin]);

  useEffect(() => {
    if (isSuccess && data) {
      useMode2InviteEarnStore.getState().setLastFetchTime(dayjs().valueOf());
      setReferralInfo(data.referralInfo);
      setPromoteHomeData(data);
    }
  }, [isSuccess, data]);
};
