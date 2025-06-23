import { useEffect } from 'react';
import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import { useLocationStore } from '@mode2/zustand/locationStore';
import { BasePagePathObj } from '@mode2/routerTypes/types';

/**
 * Evan for [V6] KYC page
 */
export const useMobileExclusiveBindKYCPageOverride = () => {
  const thisPath = BasePagePathObj.BindKYCPage;
  const location = useLocationStore((state) => state.location);
  const setConfig = useHeaderStore((state) => state.setConfig);

  useEffect(() => {
    if (thisPath === location?.pathname) {
      setConfig({
        type: EHeaderType.Common,
        title: { i18nKey: 'withdrawal_bank_account_page_title' },
      });
    }
  }, [location]);
};

export default useMobileExclusiveBindKYCPageOverride;
