import { useDeepEffect } from '@commonUtils/hooks';
import { formatMoney } from '@mode2/utils';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';

export const useWalletPageLimitStr = () => {
  const currentPayOptionItems = useWalletPageRechargeContentStore(
    (state) => state.currentPayOptionItems
  );

  const setRechargeLimitStr = useWalletPageRechargeContentStore(
    (state) => state.setRechargeLimitStr
  );

  useDeepEffect(() => {
    const optionItems = currentPayOptionItems
      ? currentPayOptionItems
      : [{ amount: 0 }];
    const amounts = optionItems.map((item) => item.amount);
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);
    const minLimit = formatMoney(min);
    const maxLimit = formatMoney(max);
    setRechargeLimitStr([minLimit, maxLimit]);
  }, [currentPayOptionItems]);
};

export default useWalletPageLimitStr;
