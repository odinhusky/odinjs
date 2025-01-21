import { useRechargeStore } from '@/zustand/wallet/rechargeStore';
import { useDeepEffect } from '@libs/commonUtils';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';

export const useRechargePayOptionSelection = () => {
  const currentPayOption = useWalletPageRechargeContentStore(
    (state) => state.currentPayOption
  );

  const setRechargeAmount = useRechargeStore(
    (state) => state.setRechargeAmount
  );

  useDeepEffect(() => {
    setRechargeAmount(`${currentPayOption.amount}`);
  }, [currentPayOption]);
};

export default useRechargePayOptionSelection;
