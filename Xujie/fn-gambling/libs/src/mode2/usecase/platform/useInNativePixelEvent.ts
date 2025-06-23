import { useEffect } from 'react';
import sdkUtils from '@mode2/utils/sdk';
import { usePostPixelEventMutation } from '@mode2API/index';
import { useAppStore } from '@mode2/zustand/appStore';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { UserRoleType } from '@mode2/@types/userRoleTypes';

/**
 * apk 渠道推廣 FB Pixel
 * android apk 後歸因上報處理
 * 只適用於 apk 內
 */
export const useInNativePixelEvent = () => {
  const isAndroidFirstInteractionSuccess = useAppStore(
    (state) => state.isAndroidFirstInteractionSuccess
  );
  const userRole = useUserProfileStore((state) => state.userRole);
  const [postPixelEvent] = usePostPixelEventMutation();

  useEffect(() => {
    if (
      sdkUtils.isInNative() &&
      isAndroidFirstInteractionSuccess &&
      [UserRoleType.USER, UserRoleType.PLAYER].includes(userRole) &&
      sdkUtils.isCurrentLogin()
    ) {
      try {
        const setting = sdkUtils.getAppSetting();
        postPixelEvent({
          accessToken: setting?.accessToken || '',
          pixelId: setting?.pixelId || '',
          fbc: setting?.fbc || '',
          fbp: setting?.fbp || '',
        });
      } catch (e) {
        console.log('error: ', e);
      }
    }
  }, [isAndroidFirstInteractionSuccess, userRole]);
};
