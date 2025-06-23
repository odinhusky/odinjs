import { useBottomNavigationStore } from '@mode2/zustand/components/bottomNavigationStore';
import { useEffect } from 'react';
import { BasePagePathObj, BasePagePaths } from '@mode2/routerTypes/types';
import { useLocationStore } from '@mode2/zustand/locationStore';
import { disabledBottomNavigationPageList } from '@mode2/usecase/components/useBottomNavigationBase';

const mobileExclusiveDisabledNavPageList = [
  ...disabledBottomNavigationPageList,
  BasePagePathObj.FeedBackPage,
  BasePagePathObj.WalletPage,
  BasePagePathObj.WalletGuidePage,
  BasePagePathObj.BindKYCPage,
  BasePagePathObj.RechargeWheelPage,
  BasePagePathObj.RankingPage,
  BasePagePathObj.ActivityDetailPage,
  BasePagePathObj.TaskCenterPage,
  BasePagePathObj.RechargeSecretPage,
];

/**
 * Evan for [V6] 底部導航控制
 */
export const useMobileExclusiveNavOverride = () => {
  const location = useLocationStore((state) => state.location);
  const isDisplayBottomNavigation = useBottomNavigationStore(
    (state) => state.isDisplayBottomNavigation
  );
  const setMobileExclusiveDisplay = useBottomNavigationStore(
    (state) => state.setMobileExclusiveDisplay
  );

  useEffect(() => {
    const isDisabled = !(
      mobileExclusiveDisabledNavPageList as readonly BasePagePaths[]
    ).includes(location?.pathname as BasePagePaths);
    setMobileExclusiveDisplay(isDisabled);
  }, [location, isDisplayBottomNavigation]);
};

export default useMobileExclusiveNavOverride;
