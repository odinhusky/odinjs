import {
  EHeaderType,
  useHeaderStore,
} from '@libs/mode2/zustand/components/headerStore';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';
import { useEffect } from 'react';

export const useMyPageHeaderSettingOverride = () => {
  const setConfig = useHeaderStore((state) => state.setConfig);

  useEffect(() => {
    useTemplateLayoutStore.getState().refreshMissionTip();

    setConfig({
      type: EHeaderType.CenterTitle,
      title: { i18nKey: 'profile_page_title' },
    });
  }, []);
};
export default useMyPageHeaderSettingOverride;
