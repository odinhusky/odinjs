import { useAppStore } from '@mode2/zustand/appStore';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { useDebouncedEffect } from '@libs/commonUtils';
import sdkUtils from '@mode2/utils/sdk';
import { UserRoleType } from '@mode2/@types/userRoleTypes';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { usePostEventAdjustPatchMutation } from '@mode2API/index';
import isEmpty from 'lodash/isEmpty';

/**
 * apk 歸因後上報補齊行為
 */
export const useAlternateAdjustADID = () => {
  const adjustADID = useAppStore((state) => state.adjustADID);
  const userRole = useUserProfileStore((state) => state.userRole);
  const location = useLocation();
  const [postEventAdjustPatch] = usePostEventAdjustPatchMutation();

  useEffect(() => {
    if (sdkUtils.isInNative() && isEmpty(adjustADID)) {
      Promise.all([
        sdkUtils.getGoogleADID(2, 300),
        sdkUtils.getAdjustADID(2, 300),
      ])
        .then(() => {})
        .catch(() => {});
    }
  }, [location.pathname, adjustADID]);

  useDebouncedEffect(
    () => {
      if (
        sdkUtils.isInNative() &&
        !isEmpty(adjustADID) &&
        [UserRoleType.USER, UserRoleType.PLAYER].includes(userRole) &&
        sdkUtils.isCurrentLogin()
      ) {
        const alternateAdjustADID = useAppStore.getState().alternateAdjustADID;
        if (!alternateAdjustADID && adjustADID) {
          postEventAdjustPatch().then((resp) => {
            console.log('@@@===> postEventAdjustPatch', resp);
            useAppStore.getState().setAlternateAdjustADID(true);
          });
        }
      }
    },
    [adjustADID, userRole],
    500
  );
};
