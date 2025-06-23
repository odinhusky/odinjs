import { usePostBrokenBoxInfoMutation } from '@libs/mode2/external/api';
import { useNavPageClick } from '@libs/mode2/usecase/useNavPageClick';
import useLowBalanceRescueBoxModalStore from '@libs/mode2/zustand/modal/LowBalanceRescueBoxModal';
import { useEffect } from 'react';

export const LowBalanceRescueBoxPage = () => {
  const [postBrokenBoxInfo, { data, isSuccess }] =
    usePostBrokenBoxInfoMutation();

  const { navToHallPage } = useNavPageClick();

  const setLowBalanceRewardInfo = useLowBalanceRescueBoxModalStore(
    (state) => state.setLowBalanceRewardInfo
  );

  useEffect(() => {
    postBrokenBoxInfo();
  }, []);

  useEffect(() => {
    if (data && isSuccess) {
      setLowBalanceRewardInfo(data);

      if (data.reward <= 0) {
        navToHallPage();
      } else {
        useLowBalanceRescueBoxModalStore
          .getState()
          .setShowLowBalanceRescueBoxModal(true);
      }
    }
  }, [data, isSuccess]);

  return null;
};

export default LowBalanceRescueBoxPage;
