import { useDeepEffect } from '@commonUtils/hooks';
import { formatMoney } from '@mode2/utils';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';

export const useWalletPageLimitStr = () => {
  const currentPayChannel = useWalletPageRechargeContentStore(
    (state) => state.currentPayChannel
  );

  const setRechargeLimitStr = useWalletPageRechargeContentStore(
    (state) => state.setRechargeLimitStr
  );

  useDeepEffect(() => {
    if (currentPayChannel && currentPayChannel.payLimit) {
      const min = currentPayChannel.payLimit.min;
      const max = currentPayChannel.payLimit.max;
      const minLimit = formatMoney(min);
      const maxLimit = formatMoney(max);
      setRechargeLimitStr([minLimit, maxLimit]);
    }
  }, [currentPayChannel]);
};

export default useWalletPageLimitStr;
