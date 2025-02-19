import {
  EHeaderType,
  useHeaderStore,
} from '@libs/mode2/zustand/components/headerStore';
import { useEffect } from 'react';

export const useMyPageHeaderSettingOverride = () => {
  const setConfig = useHeaderStore((state) => state.setConfig);

  useEffect(() => {
    setConfig({
      type: EHeaderType.CenterTitle,
      title: { i18nKey: 'Profile TODO i18n' },
    });
  }, []);
};
export default useMyPageHeaderSettingOverride;
