import { usePutMmpUpdateMutation } from '@mode2API/index';
import { useAppStore } from '@mode2/zustand/appStore';
import { useEffect } from 'react';
import sdkUtils from '@mode2/utils/sdk';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { UserRoleType } from '@mode2/@types/userRoleTypes';

export const useInNativeDeepLinkPixelInfoUpdate = () => {
  const newIntentDeepLinkWakeUpCount = useAppStore(
    (state) => state.newIntentDeepLinkWakeUpCount
  );
  const [putMmpUpdate] = usePutMmpUpdateMutation();
  const userRole = useUserProfileStore((state) => state.userRole);
  useEffect(() => {
    if (
      [UserRoleType.USER, UserRoleType.PLAYER].includes(userRole) &&
      sdkUtils.isInNative() &&
      sdkUtils.isDeepLinkWakeUp() &&
      sdkUtils.getDeepLinkAppSetting() &&
      newIntentDeepLinkWakeUpCount > 0
    ) {
      putMmpUpdate();
    }
  }, [newIntentDeepLinkWakeUpCount, userRole]);
};
