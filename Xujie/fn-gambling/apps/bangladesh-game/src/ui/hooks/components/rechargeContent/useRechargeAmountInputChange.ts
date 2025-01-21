import { useDeepEffect } from '@commonUtils/hooks';
import { useRechargeStore } from '@/zustand/wallet/rechargeStore';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';

export const useRechargeAmountInputChange = () => {
  const currentPayOptionItems = useWalletPageRechargeContentStore(
    (state) => state.currentPayOptionItems
  );
  const setCurrentOptIndexKey = useWalletPageRechargeContentStore(
    (state) => state.setCurrentOptIndexKey
  );
  const rechargeAmount = useRechargeStore((state) => state.rechargeAmount);

  // 向下匹配產品 避免null， 避免向下匹配無資料邏輯
  useDeepEffect(() => {
    const amount = Number(rechargeAmount);
    const currentItem = currentPayOptionItems.reduce((prevObj, item) => {
      return item.amount <= amount ? item : prevObj;
    }, currentPayOptionItems[0]);
    const currentOptIndexKey = currentItem ? currentItem.indexKey : '';
    setCurrentOptIndexKey(currentOptIndexKey);
  }, [rechargeAmount, currentPayOptionItems]);
};

export default useRechargeAmountInputChange;
