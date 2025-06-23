import useGuestNavigateClickStrategy from '@mode2/usecase/navPageClick/useGuestNavigateClickStrategy';
import useUserNavigateClickStrategy from '@mode2/usecase/navPageClick/useUserNavigateClickStrategy';
import usePlayerNavigateClickStrategy from '@mode2/usecase/navPageClick/usePlayerNavigateClickStrategy';

import useUserNavPageClickStrategy from '@mode2/usecase/navPageClick/useUserNavPageClickStrategy';
import usePlayerNavPageClickStrategy from '@mode2/usecase/navPageClick/usePlayerNavPageClickStrategy';
import useGuestNavPageClickStrategy from '@mode2/usecase/navPageClick/useGuestNavPageClickStrategy';
import { useMemo } from 'react';
import { useUserProfileStore } from '../zustand/user/userProfileStore';
import { UserRoleType } from '../@types/userRoleTypes';

export const useNavigateClick = () => {
  const userNavigateClickStrategy = useUserNavigateClickStrategy();
  const playerNavigateClickStrategy = usePlayerNavigateClickStrategy();
  const guestNavigateClickStrategy = useGuestNavigateClickStrategy();
  // const emptyNavigateClickStrategy = useEmptyNavigateClickStrategy();

  const userRole = useUserProfileStore((state) => state.userRole);

  const navigate = useMemo(() => {
    switch (userRole) {
      case UserRoleType.USER:
        return userNavigateClickStrategy;
      case UserRoleType.PLAYER:
        return playerNavigateClickStrategy;
      case UserRoleType.GUEST:
        return guestNavigateClickStrategy;
      default:
        return guestNavigateClickStrategy;
    }
  }, [userRole]);

  return navigate;

  // return (to: To | number, options?: NavigateOptions) => {
  //   if (sdkUtils.isCurrentLogin()) {
  //     userNavStrategy(to, options);
  //   } else {
  //     guestNavStrategy(to, options);
  //   }
  // };
};

export const useNavPageClick = () => {
  const userNavPageClickStrategy = useUserNavPageClickStrategy();
  const playerNavPageClickStrategy = usePlayerNavPageClickStrategy();
  const guestNavPageClickStrategy = useGuestNavPageClickStrategy();
  // const emptyNavPageClickStrategy = useEmptyNavPageClickStrategy();

  const userRole = useUserProfileStore((state) => state.userRole);

  const useNavPage = useMemo(() => {
    switch (userRole) {
      case UserRoleType.USER:
        return userNavPageClickStrategy;
      case UserRoleType.PLAYER:
        return playerNavPageClickStrategy;
      case UserRoleType.GUEST:
        return guestNavPageClickStrategy;
      default:
        return guestNavPageClickStrategy;
    }
  }, [userRole]);

  return useNavPage;
};
