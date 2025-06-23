import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import { useEffect } from 'react';
import InBoxButton from './components/InBoxButton';
import LuckyWheelButton from './components/LuckyWheelButton';
import { useIsLoginStore } from '@mode2/zustand/loginStore';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { UserRoleType } from '@mode2/@types/userRoleTypes';
import LowBalanceRescueBoxButton from '@components/LowBalanceRescueBoxButton';

export const useHallPageHeaderSettingOverride = () => {
  const setConfig = useHeaderStore((state) => state.setConfig);

  const isLogin = useIsLoginStore((state) => state.isLogin);
  const userRole = useUserProfileStore((state) => state.userRole);

  useEffect(() => {
    setConfig({
      type: EHeaderType.Main,
      render: () => {
        return (
          <div className={' flex w-full gap-2 justify-end items-center'}>
            <LowBalanceRescueBoxButton />
            {[UserRoleType.USER, UserRoleType.PLAYER].includes(userRole) ? (
              <LuckyWheelButton />
            ) : null}
            <InBoxButton />
          </div>
        );
      },
    });
  }, [isLogin, userRole]);
};

export default useHallPageHeaderSettingOverride;
