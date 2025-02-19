import {
  usePostPlayerBindReferCodeMutation,
  usePostPlayerInfoSaveMutation,
} from '@libs/mode2/external/api';
import sdkUtils from '@libs/mode2/utils/sdk';
import { AdjustEventKey } from '@libs/mode2/utils/sdk/persistant/adjust/AdjustEventKey';
import { useMessageStore } from '@libs/mode2/zustand/components/messageStore';
import {
  TLoginFormProps,
  useAccountPageStore,
} from '@libs/mode2/zustand/page/accountPageStore';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { t } from 'i18next';
import { useEffect, useState } from 'react';

export const useAccount = () => {
  // const { refreshUserState } = useUserState();

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

  const realPhone = useUserProfileStore((state) => state.realPhone);
  const setShowEditModal = useAccountPageStore(
    (state) => state.setShowEditModal
  );

  // 編輯暱稱
  const editNickname = ({ nickname }: { nickname: string }) => {
    postPlayerInfoSave({
      userName: nickname,
      phone: realPhone, // 編輯暱稱modal只需要修改暱稱
      isBindAll: false, // 是否同時綁定個人和銀行資訊
    });
  };

  // 綁定邀請碼 TODO Ronan TODO Evan check API 500 待測試
  const bindInviteCode = ({ referCode }: { referCode: string }) => {
    console.log(referCode);
    postPlayerBindReferCode({
      referCode,
    });
  };

  // 綁定登錄密碼 TODO Ronan TODO Evan check API
  const bindPassword = (loginForm: TLoginFormProps) => {
    console.log('@@@===> loginForm', loginForm);

    useMessageStore.getState().success(t('toast_payment_info_saved'));

    setTimeout(() => {
      setShowEditModal(false);
    }, 500);
  };

  useEffect(() => {
    if (isPlayerInfoSuccess) {
      sdkUtils.sendEvent(AdjustEventKey.RECHARGE_INFO_VERIFICATION);
      useMessageStore.getState().success(t('toast_payment_info_saved'));
      // refreshUserState();

      setTimeout(() => {
        setShowEditModal(false);
      }, 500);
    } else {
      console.log('@@ bindPlayerInfoFail');
    }
  }, [isPlayerInfoSuccess]);

  useEffect(() => {
    if (isPlayerBindReferCodeSuccess) {
      useMessageStore.getState().success(t('toast_payment_info_saved'));

      setTimeout(() => {
        setShowEditModal(false);
      }, 500);
    } else {
      console.log('@@ bindPlayerReferCodeail');
    }
  }, [isPlayerBindReferCodeSuccess]);

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
