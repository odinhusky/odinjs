import { usePostWalletAndOtherBankListMutation } from '@/external/api';
import { useBindKYCPageDiffStore } from '@/zustand/page/bindKYCPageDiffStore';
import { useDeepEffect } from '@libs/commonUtils';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';

export const useKYCInitDiff = () => {
  const setBankWalletList = useBindKYCPageDiffStore(
    (state) => state.setBankWalletList
  );

  const setOtherBankList = useBindKYCPageDiffStore(
    (state) => state.setOtherBankList
  );

  const [
    triggerPostWalletAndOtherBankList,
    {
      data: walletAndOtherBankList,
      isSuccess: isPostWalletAndOtherBankListSuccess,
    },
  ] = usePostWalletAndOtherBankListMutation();

  useEffect(() => {
    // 取得 Wallet 以及 Banks(Other Bank 的 Select option List)
    triggerPostWalletAndOtherBankList();
  }, []);

  useDeepEffect(() => {
    if (!isEmpty(walletAndOtherBankList)) {
      const walletList = walletAndOtherBankList.walletList;

      const otherBankList = walletAndOtherBankList.bankOptionList;

      setBankWalletList(walletList);
      setOtherBankList(otherBankList);
    }
  }, [walletAndOtherBankList, isPostWalletAndOtherBankListSuccess]);
};

export default useKYCInitDiff;
