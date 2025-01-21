import { usePostVIPHomeMutation } from '@mode2API/index';
import { useMyPageStore } from '@mode2/zustand/page/myPageStore';
import { useDeepEffect } from '@libs/commonUtils';
import { useEffect } from 'react';

export const useMyVipContentBase = () => {
  const [triggerVIPHome, { data: vipHome }] = usePostVIPHomeMutation();

  const setVipTableDatas = useMyPageStore((state) => state.setVipTableDatas);
  const setVipLevel = useMyPageStore((state) => state.setVipLevel);
  const setVipProgressPercent = useMyPageStore(
    (state) => state.setVipProgressPercent
  );
  const setRechargeAmount = useMyPageStore((state) => state.setRechargeAmount);

  useDeepEffect(() => {
    if (!vipHome) return;

    setVipTableDatas(vipHome.vipInfos);
    setVipLevel(vipHome.vipLevel);
    setVipProgressPercent(vipHome.vipPercent);
    setRechargeAmount(vipHome.rechargeAmount);
  }, [vipHome]);

  useEffect(() => {
    triggerVIPHome();
  }, []);
};

export default useMyVipContentBase;
