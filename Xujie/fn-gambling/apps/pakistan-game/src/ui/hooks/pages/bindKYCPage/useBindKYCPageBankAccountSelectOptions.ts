import { useBindKYCPageDiffStore } from '@/zustand/page/bindKYCPageDiffStore';
import { useDeepEffect } from '@libs/commonUtils';

export const useBindKYCPageBankAccountSelectOptions = () => {
  const otherBankList = useBindKYCPageDiffStore((state) => state.otherBankList);

  const setBankAccountSelectOptions = useBindKYCPageDiffStore(
    (state) => state.setBankAccountSelectOptions
  );

  useDeepEffect(() => {
    const optionList = otherBankList.map((item) => ({
      label: item.label,
      value: item.value,
      key: item.value,
    }));

    setBankAccountSelectOptions(optionList);
  }, [otherBankList]);
};

export default useBindKYCPageBankAccountSelectOptions;
