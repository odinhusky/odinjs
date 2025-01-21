import { useEffect } from 'react';
import { useBreakPoint } from '@libs/commonUtils/hooks/useBreakPoint';
import {
  EHeaderType,
  useHeaderStore,
} from '@libs/mode2/zustand/components/headerStore';
import { useNavigateClick } from '@mode2/usecase/useNavPageClick';

export const usePolicyPageHeaderSetting = () => {
  const { isDesktop } = useBreakPoint();
  const navigate = useNavigateClick();

  const setConfig = useHeaderStore((state) => state.setConfig);

  useEffect(() => {
    if (isDesktop) {
      setConfig({
        type: EHeaderType.Main,
      });
    } else {
      setConfig({
        type: EHeaderType.Common,
        title: { i18nKey: 'footer_privacy_policy' },
        onBack: () => {
          navigate(-1);
        },
      });
    }
  }, [isDesktop]);
};
export default usePolicyPageHeaderSetting;
