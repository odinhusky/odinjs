import { useMode2ChangePasswordPageStore } from '@libs/mode2/zustand/page/changePasswordPageStore';
import { useEffect } from 'react';

export const useChangePasswordPageInitData = () => {
  const setCurrentPasswordInputValue = useMode2ChangePasswordPageStore(
    (state) => state.setCurrentPasswordInputValue
  );

  const setNewPasswordInputValue = useMode2ChangePasswordPageStore(
    (state) => state.setNewPasswordInputValue
  );

  const setConfirmPasswordInputValue = useMode2ChangePasswordPageStore(
    (state) => state.setConfirmPasswordInputValue
  );

  useEffect(() => {
    setCurrentPasswordInputValue('');
    setNewPasswordInputValue('');
    setConfirmPasswordInputValue('');
  }, []);
};

export default useChangePasswordPageInitData;
