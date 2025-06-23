import { usePostVIPHomeMutation } from '@mode2API/index';
import { useMyPageStore } from '@mode2/zustand/page/myPageStore';
import { useDeepEffect } from '@libs/commonUtils';
import { useEffect } from 'react';

export const useMyVipContentBase = () => {
  const [postVIPHome, { data: vipHome }] = usePostVIPHomeMutation();

  const setVipTableDatas = useMyPageStore((state) => state.setVipTableDatas);
  const setVipProgressPercent = useMyPageStore(
    (state) => state.setVipProgressPercent
  );
  const setRechargeAmount = useMyPageStore((state) => state.setRechargeAmount);
  const setVipRewardDama = useMyPageStore((state) => state.setVipRewardDama);

  useDeepEffect(() => {
    if (!vipHome) return;

    setVipTableDatas(vipHome.vipInfos);
    setVipProgressPercent(vipHome.vipPercent);
    setRechargeAmount(vipHome.rechargeAmount);
    setVipRewardDama(vipHome.rewardDamaTimes);
  }, [vipHome]);

  useEffect(() => {
    postVIPHome();
  }, []);
};

export default useMyVipContentBase;
