import {
  EHeaderType,
  useHeaderStore,
} from '@libs/mode2/zustand/components/headerStore';
import { useEffect } from 'react';
import { useNavigateClick } from '@mode2/usecase/useNavPageClick';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { useLocation } from 'react-router';

export const useMoreGamePageHeaderSetting = () => {
  const navigate = useNavigateClick();
  const thisPath = BasePagePathObj.MoreGamePage;
  const location = useLocation();
  const setConfig = useHeaderStore((state) => state.setConfig);

  useEffect(() => {
    if (location.pathname === thisPath) {
      setConfig({
        type: EHeaderType.MoreGame,
        onBack: () => {
          navigate(-1);
        },
      });
    }
  }, []);
};

export default useMoreGamePageHeaderSetting;
