import { create } from 'zustand';
import { devtoolsAndPersistWrapper } from '../middlewareWrapper';

export type ChangePasswordPageStoreTypes = {
  data: boolean;
  setIsFirstModify: (data: boolean) => void;
  currentPasswordInputValue: string;
  setCurrentPasswordInputValue: (value: string) => void;
  newPasswordInputValue: string;
  setNewPasswordInputValue: (value: string) => void;
  confirmPasswordInputValue: string;
  setConfirmPasswordInputValue: (value: string) => void;
};

export const useMode2ChangePasswordPageStore =
  create<ChangePasswordPageStoreTypes>()(
    devtoolsAndPersistWrapper(
      '[page store] useMode2ChangePasswordPageStore',
      (set) => ({
        data: false,
        setIsFirstModify: (data) => set(() => ({ data })),
        currentPasswordInputValue: '',
        setCurrentPasswordInputValue: (value) =>
          set(() => ({
            currentPasswordInputValue: value,
          })),
        newPasswordInputValue: '',
        setNewPasswordInputValue: (value) =>
          set(() => ({
            newPasswordInputValue: value,
          })),
        confirmPasswordInputValue: '',
        setConfirmPasswordInputValue: (value) =>
          set(() => ({
            confirmPasswordInputValue: value,
          })),
      })
    )
  );
