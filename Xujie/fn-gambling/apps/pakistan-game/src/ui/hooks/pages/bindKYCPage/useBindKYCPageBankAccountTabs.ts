import { useBindKYCPageDiffStore } from '@/zustand/page/bindKYCPageDiffStore';
import { useDeepEffect } from '@libs/commonUtils';

export const useBindKYCPageBankAccountTabs = () => {
  const bankWalletList = useBindKYCPageDiffStore(
    (state) => state.bankWalletList
  );

  const setBankAccountTabList = useBindKYCPageDiffStore(
    (state) => state.setBankAccountTabList
  );

  useDeepEffect(() => {
    const dynamicList = [...bankWalletList];

    const mixTabList = [
      ...dynamicList,
      {
        code: 'OTHER_BANKS',
        name: 'Other banks', // TODO I18n 尚未實作
      },
    ];

    setBankAccountTabList(mixTabList);
  }, [bankWalletList]);
};

export default useBindKYCPageBankAccountTabs;
