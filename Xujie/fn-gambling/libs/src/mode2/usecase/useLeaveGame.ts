import { useEffect, useState } from 'react';
import useLeaveGameConfirmModalStore from '@mode2/zustand/components/leaveGameConfirmModalStore';
import { usePostQuiteGameMutation } from '@mode2API/index';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import { useGameLoadingStore } from '@mode2/zustand/components/gameLoadingStore';
import { useUserProfileStore } from '../zustand/user/userProfileStore';

export const useLeaveGame = () => {
  const setIsShowLeaveGameConfirmModal = useLeaveGameConfirmModalStore(
    (state) => state.setIsShowLeaveGameConfirmModal
  );
  const setIsShowGameLoading = useGameLoadingStore(
    (state) => state.setIsShowGameLoading
  );
  const { navToHallPage } = useNavPageClick();
  const refreshUserData = useUserProfileStore((state) => state.refreshUserData);

  const [postQuiteGame, { isSuccess: isQuiteGameSuccess }] =
    usePostQuiteGameMutation();

  useEffect(() => {
    if (isQuiteGameSuccess) {
      navToHallPage();
      setIsShowLeaveGameConfirmModal(false);
      setRefreshCount(3);
    }
  }, [isQuiteGameSuccess]);
  const handleConfirmLeave = () => {
    setIsShowGameLoading(true);
    postQuiteGame();
  };
  const [refreshCount, setRefreshCount] = useState(0);
  useEffect(() => {
    if (refreshCount === 0) return;
    const timer = setTimeout(
      () => {
        refreshUserData();
        setRefreshCount((pre) => pre - 1);
      },
      refreshCount < 3 ? 10000 : 2000
    );
    return () => {
      clearTimeout(timer);
    };
  }, [refreshCount]);
  useEffect(() => {
    return () => {
      setIsShowLeaveGameConfirmModal(false);
      setIsShowGameLoading(false);
    };
  }, []);
  return {
    handleConfirmLeave,
  };
};
