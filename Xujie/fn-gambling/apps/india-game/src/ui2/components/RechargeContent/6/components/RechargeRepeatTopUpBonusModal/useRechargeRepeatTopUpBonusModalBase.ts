import { useRechargeStore } from '@/zustand/wallet/rechargeStore';
import { useEffect } from 'react';
import useRechargeRepeatTopUpBonusModalStore from '@mode2/zustand/modal/RechargeRepeatTopUpBonusModal';

export const useRechargeRepeatTopUpBonusModalBase = () => {
  const payAdditionalOptions = useRechargeStore(
    (state) => state.payAdditionalOptions
  );
  const setPayAddOnOptions = useRechargeRepeatTopUpBonusModalStore(
    (state) => state.setPayAddOnOptions
  );
  const setCurrentPayAddOnOption = useRechargeRepeatTopUpBonusModalStore(
    (state) => state.setCurrentPayAddOnOption
  );
  const isShowRechargeRepeatTopUpBonusModal =
    useRechargeRepeatTopUpBonusModalStore(
      (state) => state.isShowRechargeRepeatTopUpBonusModal
    );

  useEffect(() => {
    const options = payAdditionalOptions.map((item) => {
      if (item.isDefaultSelected) {
        setCurrentPayAddOnOption({ ...item });
      }
      return {
        ...item,
      };
    });
    setPayAddOnOptions(options);
  }, [payAdditionalOptions, isShowRechargeRepeatTopUpBonusModal]);
};
