import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import {
  handleAccountPageCopyClick,
  handleAccountPageInviteChange,
  handleAccountPageLoginPasswordChange,
  handleAccountPageModalClose,
  handleAccountPageNicknameChange,
  handleAccountPageSaveGenderClick,
  handleAccountPageShowBindPlayerPhoneModalClick,
  handleAccountPageShowModalClick,
} from '@mode2/action/actionTypes';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import handleGlobalClick from '@mode2/action/handleGlobalClick';
import handleAction from '@mode2/action/common/handleAction';
import {
  AccountPageGenderTypes,
  AccountPageModalTitleTypes,
  useAccountPageStore,
} from '@libs/mode2/zustand/page/accountPageStore';
import { useClipboard } from '@libs/commonUtils';
import { usePostUpdateGenderMutation } from '@libs/mode2/external/api';
import { useEffect } from 'react';
import useBindPlayerPhoneModalStore, {
  BindType,
} from '@libs/mode2/zustand/modal/BindPlayerPhoneModal';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { useMessageStore } from '@libs/mode2/zustand/components/messageStore';
import { useTranslation } from 'react-i18next';
import { INV6 } from '@libs/constant/versions';

type ActionClickPayloadMap = {
  [handleAccountPageShowModalClick]: { value: AccountPageModalTitleTypes };
  [handleAccountPageCopyClick]: { value: string };
  [handleAccountPageModalClose]: void;
  [handleAccountPageSaveGenderClick]: { gender: AccountPageGenderTypes };
  [handleAccountPageNicknameChange]: { value: string };
  [handleAccountPageInviteChange]: { value: string };
  [handleAccountPageLoginPasswordChange]: {
    value: string;
    type: string;
  };
  [handleAccountPageShowBindPlayerPhoneModalClick]: void;
};

export interface HandleAccountPageOnEventProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

const useAccountPageAction = () => {
  const { t } = useTranslation();
  // const {} = useNavPageClick();
  const setModalTitle = useAccountPageStore((state) => state.setModalTitle);
  const setShowEditModal = useAccountPageStore(
    (state) => state.setShowEditModal
  );
  const realPhone = useUserProfileStore((state) => state.realPhone);
  const setNickname = useAccountPageStore((state) => state.setNickname);
  const setGender = useAccountPageStore((state) => state.setGender);
  const setReferCode = useAccountPageStore((state) => state.setReferCode);
  const loginForm = useAccountPageStore((state) => state.loginForm);
  const setLoginForm = useAccountPageStore((state) => state.setLoginForm);
  const setShowBindPlayerPhoneModal = useBindPlayerPhoneModalStore(
    (state) => state.setShowBindPlayerPhoneModal
  );
  const setBindType = useBindPlayerPhoneModalStore(
    (state) => state.setBindType
  );
  const refreshUserData = useUserProfileStore((state) => state.refreshUserData);

  const { copyToClipboard } = useClipboard();

  const [trigger, { isSuccess }] = usePostUpdateGenderMutation();

  useEffect(() => {
    if (isSuccess) {
      useMessageStore
        .getState()
        .success(t('profile_my_info_select_gender_success_toast'));
      refreshUserData();
      setShowEditModal(false);
    }
  }, [isSuccess]);

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleAccountPageShowModalClick]: ({ value }) => {
      handleGlobalClick({
        target: handleAccountPageShowModalClick,
        payload: { value },
        callback: () => {
          setShowEditModal(true);
          setModalTitle(value);

          setLoginForm({ ...loginForm, phone: realPhone || '' });
        },
      });
    },
    [handleAccountPageCopyClick]: ({ value }) => {
      handleGlobalClick({
        target: handleAccountPageCopyClick,
        payload: { value },
        callback: () => {
          copyToClipboard(value, {
            successMessage:
              import.meta.env['VITE_V_VERSION'] === INV6
                ? 'spin_and_share_wheel_copied_toast'
                : '',
            resetInterval: 100,
          });
        },
        debounceTimer: 300,
      });
    },
    [handleAccountPageModalClose]: () => {
      handleGlobalClick({
        target: handleAccountPageModalClose,
        callback: () => {
          setShowEditModal(false);
        },
      });
    },

    [handleAccountPageSaveGenderClick]: ({ gender }) => {
      handleGlobalClick({
        target: handleAccountPageSaveGenderClick,
        payload: { gender },
        callback: () => {
          setGender(gender);
          trigger({ gender });
        },
      });
    },
    [handleAccountPageNicknameChange]: ({ value }) => {
      handleGlobalClick({
        target: handleAccountPageNicknameChange,
        payload: { value },
        callback: () => {
          setNickname(value);
        },
      });
    },
    [handleAccountPageInviteChange]: ({ value }) => {
      handleGlobalClick({
        target: handleAccountPageInviteChange,
        payload: { value },
        callback: () => {
          setReferCode(value);
        },
      });
    },
    [handleAccountPageLoginPasswordChange]: ({ value, type }) => {
      handleGlobalClick({
        target: handleAccountPageLoginPasswordChange,
        payload: { value, type },
        callback: () => {
          setLoginForm({ ...loginForm, [type]: value });
        },
      });
    },
    [handleAccountPageShowBindPlayerPhoneModalClick]: () => {
      handleGlobalClick({
        target: handleAccountPageShowBindPlayerPhoneModalClick,
        callback: () => {
          setShowBindPlayerPhoneModal(true);
          setBindType(BindType.BIND_PHONE);
        },
      });
    },
  };

  const handleAccountPageClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleAccountPageOnEventProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleAccountPageClick,
  };
};

export default useAccountPageAction;
