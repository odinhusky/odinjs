import {
  EHeaderType,
  IConfig,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';

export const useHeaderBase = (props: Partial<IConfig>) => {
  const configStoreState = useHeaderStore((state) => state.config);

  const config =
    Object.keys(props).length > 0
      ? { type: EHeaderType.Main, ...props }
      : configStoreState;
  // const { refreshUserData, isRefreshLoading } = useUserState();

  // const isLogin = useIsLoginStore((state) => state.isLogin);
  // const totalAssets = useUserProfileStore((state) => state.totalAssets);
  // const level = useUserProfileStore((state) => state.level);
  // const avatarOrder = useUserProfileStore((state) => state.avatarOrder);

  // const userInfo = {
  //   totalAssets,
  //   level,
  //   avatarOrder,
  // };

  // const manufacturer = useMoreGamePageStoreStore((state) => state.manufacturer);
  //
  // const moreGameLogo = getImgUrl(
  //   EResourceLevel.V,
  //   `logo_${manufacturer.toLowerCase()}`
  // );

  // const refreshAccount = () => {
  //   sdkUtils.playSound();
  //   // refreshUserData();
  // };

  // const { handleHeaderClick } = useHeaderAction();

  return {
    // moreGameLogo,
    // isLogin,
    // userInfo,
    // refreshAccount,
    // isRefreshLoading,
    config,
    // handleHeaderClick,
    // totalAssets,
  };
};
