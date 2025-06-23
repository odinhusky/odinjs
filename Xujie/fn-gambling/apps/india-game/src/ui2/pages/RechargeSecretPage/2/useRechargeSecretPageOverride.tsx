import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { useLocationStore } from '@mode2/zustand/locationStore';
import { useEffect } from 'react';
import { RechargeSecretPageMobileHeader } from './components/RechargeSecretPageMobileHeader';

export const useRechargeSecretPageOverride = () => {
  const setConfig = useHeaderStore((state) => state.setConfig);
  const thisPath = BasePagePathObj.RechargeSecretPage;
  const location = useLocationStore((state) => state.location);

  useEffect(() => {
    if (location?.pathname === thisPath) {
      setConfig({
        type: EHeaderType.Common,
        title: { i18nKey: 'Secret bonus' }, // TODO Evan i18n
        headerBgColor: 'bgi-[var(--base-2-variant5)]',
        render: () => {
          return <RechargeSecretPageMobileHeader />;
        },
      });
    }
  }, [location]);
};
