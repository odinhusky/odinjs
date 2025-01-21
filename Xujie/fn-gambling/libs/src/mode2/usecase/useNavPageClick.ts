import useGuestNavigateClickStrategy from '@mode2/usecase/navPageClick/useGuestNavigateClickStrategy';
import useUserNavigateClickStrategy from '@mode2/usecase/navPageClick/useUserNavigateClickStrategy';
import useUserNavPageClickStrategy from '@mode2/usecase/navPageClick/useUserNavPageClickStrategy';
import useGuestNavPageClickStrategy from '@mode2/usecase/navPageClick/useGuestNavPageClickStrategy';
import { useIsLoginStore } from '@mode2/zustand/loginStore';
import { useMemo } from 'react';

export const useNavigateClick = () => {
  const userNavStrategy = useUserNavigateClickStrategy();
  const guestNavStrategy = useGuestNavigateClickStrategy();

  const isLogin = useIsLoginStore((state) => state.isLogin);

  const useUSeNavigate = useMemo(() => {
    return isLogin ? userNavStrategy : guestNavStrategy;
  }, [isLogin]);
  return useUSeNavigate;

  // return (to: To | number, options?: NavigateOptions) => {
  //   if (sdkUtils.isCurrentLogin()) {
  //     userNavStrategy(to, options);
  //   } else {
  //     guestNavStrategy(to, options);
  //   }
  // };
};

export const useNavPageClick = () => {
  const userNavStrategy = useUserNavPageClickStrategy();
  const guestNavStrategy = useGuestNavPageClickStrategy();

  const isLogin = useIsLoginStore((state) => state.isLogin);

  const useUSeNavigate = useMemo(() => {
    return isLogin ? userNavStrategy : guestNavStrategy;
  }, [isLogin]);
  return useUSeNavigate;
};
