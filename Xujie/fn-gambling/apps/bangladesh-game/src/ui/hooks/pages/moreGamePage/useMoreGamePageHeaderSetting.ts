import {
  EHeaderType,
  useHeaderStore,
} from '@libs/mode2/zustand/components/headerStore';
import { useEffect } from 'react';
import { useNavigateClick } from '@mode2/usecase/useNavPageClick';

export const useMoreGamePageHeaderSetting = () => {
  const navigate = useNavigateClick();
  const setConfig = useHeaderStore((state) => state.setConfig);

  useEffect(() => {
    setConfig({
      type: EHeaderType.MoreGame,
      onBack: () => {
        navigate(-1);
      },
    });
  }, []);
};

export default useMoreGamePageHeaderSetting;
