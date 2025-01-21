import {
  handleChangePasswordConfirmPasswordInputValueChange,
  handleChangePasswordNewPasswordInputValueChange,
  handleChangePasswordPageCurrentPasswordInputValueChange,
  handleChangePasswordSaveBtnClick,
} from './actionType';
import sdkUtils from '@libs/mode2/utils/sdk';
import handleAction from '../common/handleAction';
import handleGlobalClick from '../handleGlobalClick';
import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import { useMode2ChangePasswordPageStore } from '@libs/mode2/zustand/page/changePasswordPageStore';
import { useEffect, useState } from 'react';
import { usePostChangePasswordMutation } from '@mode2API/index';
import { AppLocalStorageKey } from '@libs/mode2/utils/sdk/persistant/storageKey';
import { useNavigateClick } from '@mode2/usecase/useNavPageClick';

type ActionClickPayloadMap = {
  // 其他 ActionClickType 對應的參數類型
  [handleChangePasswordPageCurrentPasswordInputValueChange]: { value: string };
  [handleChangePasswordNewPasswordInputValueChange]: { value: string };
  [handleChangePasswordConfirmPasswordInputValueChange]: { value: string };
  [handleChangePasswordSaveBtnClick]: {
    oldPassword: string;
    newPassword: string;
  };
};

export interface HandleChangePasswordPageOnEventProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useChangePasswordPageActions = () => {
  const navigate = useNavigateClick();
  const setCurrentPasswordInputValue = useMode2ChangePasswordPageStore(
    (state) => state.setCurrentPasswordInputValue
  );

  const setNewPasswordInputValue = useMode2ChangePasswordPageStore(
    (state) => state.setNewPasswordInputValue
  );

  const setConfirmPasswordInputValue = useMode2ChangePasswordPageStore(
    (state) => state.setConfirmPasswordInputValue
  );

  const [postChangePassword, { data, isSuccess, isError, isLoading }] =
    usePostChangePasswordMutation();

  useEffect(() => {
    if (isSuccess && data) {
      sdkUtils.setStorage(AppLocalStorageKey.TOKEN, data.token);
      setCurrentPasswordInputValue('');
      setNewPasswordInputValue('');
      setConfirmPasswordInputValue('');
      navigate(-1);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) {
      // console.log("=====================设置错误", error);
    }
  }, [isError]);

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    // 当前密码
    [handleChangePasswordPageCurrentPasswordInputValueChange]: ({ value }) => {
      handleGlobalClick({
        target: handleChangePasswordPageCurrentPasswordInputValueChange,
        callback: () => {
          setCurrentPasswordInputValue(value);
        },
      });
    },
    // 新密码
    [handleChangePasswordNewPasswordInputValueChange]: ({ value }) => {
      handleGlobalClick({
        target: handleChangePasswordNewPasswordInputValueChange,
        callback: () => {
          setNewPasswordInputValue(value);
        },
      });
    },
    // 确认密码
    [handleChangePasswordConfirmPasswordInputValueChange]: ({ value }) => {
      handleGlobalClick({
        target: handleChangePasswordConfirmPasswordInputValueChange,
        callback: () => {
          setConfirmPasswordInputValue(value);
        },
      });
    },
    // 保存
    [handleChangePasswordSaveBtnClick]: ({ oldPassword, newPassword }) => {
      handleGlobalClick({
        target: handleChangePasswordSaveBtnClick,
        callback: () => {
          // console.log('-------------------', oldPassword, newPassword);
          postChangePassword({
            oldPassword: oldPassword,
            newPassword: newPassword,
          });
        },
      });
    },
  };

  const handleChangePasswordPageClick = <
    T extends keyof ActionClickPayloadMap
  >({
    actionName,
    payload,
  }: HandleChangePasswordPageOnEventProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    setDisabled(isLoading);
  }, [isLoading])

  return {
    actionClickObj,
    handleChangePasswordPageClick,
    disabled
  };
};

export default useChangePasswordPageActions;
