import { useDeepEffect } from '@commonUtils/hooks';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';

export const useRechargeRebateAmountChange = () => {
  const currentPayOptionItems = useWalletPageRechargeContentStore(
    (state) => state.currentPayOptionItems
  );
  const currentOptIndexKey = useWalletPageRechargeContentStore(
    (state) => state.currentOptIndexKey
  );
  const setCurrentOptRebateAmount = useWalletPageRechargeContentStore(
    (state) => state.setCurrentOptRebateAmount
  );
  const setCurrentOptAmount = useWalletPageRechargeContentStore(
    (state) => state.setCurrentOptAmount
  );
  const setCurrentOptCashBackRate = useWalletPageRechargeContentStore(
    (state) => state.setCurrentOptCashBackRate
  );

  useDeepEffect(() => {
    const currentItem = currentPayOptionItems.find(
      (item) => item.indexKey === currentOptIndexKey
    );
    setCurrentOptAmount(currentItem?.amount || 0);
    setCurrentOptRebateAmount(currentItem?.rebateAmount || 0);
    setCurrentOptCashBackRate(currentItem?.cashBackRate || 0);
  }, [currentOptIndexKey, currentPayOptionItems]);
};

export default useRechargeRebateAmountChange;
