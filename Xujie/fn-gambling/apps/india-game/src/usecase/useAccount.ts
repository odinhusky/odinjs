import { useUpdateEffect } from '@libs/commonUtils';
import {
  usePostPlayerBindAccountMutation,
  usePostPlayerBindReferCodeMutation,
  usePostPlayerInfoSaveMutation,
} from '@libs/mode2/external/api';
import sdkUtils from '@libs/mode2/utils/sdk';
import { AdjustEventKey } from '@libs/mode2/utils/sdk/persistant/adjust/AdjustEventKey';
import { useMessageStore } from '@libs/mode2/zustand/components/messageStore';
import { useOTPCountDownStore } from '@libs/mode2/zustand/components/OTPCountDownStore';
import {
  TLoginFormProps,
  useAccountPageStore,
} from '@libs/mode2/zustand/page/accountPageStore';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { useEffect, useState } from 'react';
import { useUserState } from './useUserState';
import { useTranslation } from 'react-i18next';
import { useTaskCenterPageStore } from '@mode2/zustand/page/TaskCenterPage/taskCenterPageStore';

export const useAccount = () => {
  const { refreshUserState } = useUserState();
  const { t } = useTranslation();

  const [
    postPlayerInfoSave,
    { isSuccess: isPlayerInfoSuccess, isLoading: isPlayerInfoLoading },
  ] = usePostPlayerInfoSaveMutation();
  const [
    postPlayerBindReferCode,
    {
      isSuccess: isPlayerBindReferCodeSuccess,
      isLoading: isPlayerBindReferCodeLoading,
    },
  ] = usePostPlayerBindReferCodeMutation();

  const [postBind, { data: bindPlayerPhoneData, isSuccess: isBindSuccess }] =
    usePostPlayerBindAccountMutation();

  const setUserRole = useUserProfileStore((state) => state.setUserRole);

  const otpId = useOTPCountDownStore((state) => state.otpId);

  const realPhone = useUserProfileStore((state) => state.realPhone);
  const setShowEditModal = useAccountPageStore(
    (state) => state.setShowEditModal
  );
  // const loginForm = useAccountPageStore((state) => state.loginForm);
  const setLoginForm = useAccountPageStore((state) => state.setLoginForm);
  const setReferCode = useAccountPageStore((state) => state.setReferCode);
  const setNickname = useAccountPageStore((state) => state.setNickname);

  // 編輯暱稱
  const editNickname = ({ nickname }: { nickname: string }) => {
    postPlayerInfoSave({
      userName: nickname,
      phone: realPhone, // 編輯暱稱modal只需要修改暱稱
      isBindAll: false, // 是否同時綁定個人和銀行資訊
    });
  };

  // 綁定邀請碼
  const bindInviteCode = ({ referCode }: { referCode: string }) => {
    console.log(referCode);
    postPlayerBindReferCode({
      referCode,
    });
  };

  // 綁定登錄密碼
  const bindPassword = (loginForm: TLoginFormProps) => {
    console.log('@@@===> loginForm', loginForm);

    postBind({
      otpCode: loginForm.otpCode,
      otpId: otpId,
      phone: loginForm.phone,
      password: loginForm.password,
    });
  };

  useEffect(() => {
    if (isPlayerInfoSuccess) {
      sdkUtils.sendEvent(AdjustEventKey.RECHARGE_INFO_VERIFICATION);
      useMessageStore
        .getState()
        .success(t('profile_my_info_select_gender_success_toast'));
      useTaskCenterPageStore.getState().refreshTaskCenter();
      refreshUserState();

      setTimeout(() => {
        setShowEditModal(false);
        setNickname('');
      }, 500);
    } else {
      console.log('@@ bindPlayerInfoFail');
    }
  }, [isPlayerInfoSuccess]);

  useEffect(() => {
    if (isPlayerBindReferCodeSuccess) {
      useMessageStore
        .getState()
        .success(t('profile_my_info_select_gender_success_toast'));
      useTaskCenterPageStore.getState().refreshTaskCenter();
      refreshUserState();

      setTimeout(() => {
        setShowEditModal(false);
        setReferCode('');
      }, 500);
    } else {
      console.log('@@ bindPlayerReferCodeail');
    }
  }, [isPlayerBindReferCodeSuccess]);

  useUpdateEffect(() => {
    if (isBindSuccess) {
      useMessageStore
        .getState()
        .success(t('profile_my_info_select_gender_success_toast'));
      useTaskCenterPageStore.getState().refreshTaskCenter();
      refreshUserState();
    }
    setTimeout(() => {
      setShowEditModal(false);
      setLoginForm({
        phone: realPhone,
        otpCode: '',
        password: '',
        confirmPassword: '',
      });
    }, 500);

    if (bindPlayerPhoneData?.userRole) {
      setUserRole(bindPlayerPhoneData?.userRole);
    }
  }, [isBindSuccess]);

  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    setDisabled(isPlayerInfoLoading || isPlayerBindReferCodeLoading);
  }, [isPlayerInfoLoading, isPlayerBindReferCodeLoading]);

  return {
    editNickname,
    bindInviteCode,
    bindPassword,
    disabled,
  };
};
