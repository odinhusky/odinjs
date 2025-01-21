import { useDeepEffect } from '@libs/commonUtils';
import { rechargeWheelLevelTypeMapping } from '@libs/mode2/@types/rechargeWheelLevelTypes';
import { usePostWheelPlayerProgressMutation } from '@libs/mode2/external/api';
import { useIsLoginStore } from '@libs/mode2/zustand/loginStore';
import useMode2RechargeWheelPageStore from '@libs/mode2/zustand/page/rechargeWheelPage';
import { get, isEmpty } from 'lodash';
import { useEffect } from 'react';

export const useRechargeWheelPlayerProgress = () => {
  const [
    triggerPostWheelPlayerProgress,
    {
      data: WheelPlayerProgressData,
      isSuccess: isPostWheelPlayerProgressSuccess,
    },
  ] = usePostWheelPlayerProgressMutation();

  const isLogin = useIsLoginStore((state) => state.isLogin);

  const postPlayerProgressCount = useMode2RechargeWheelPageStore(
    (state) => state.postPlayerProgressCount
  );

  const setCurrentDeposit = useMode2RechargeWheelPageStore(
    (state) => state.setCurrentDeposit
  );

  const setWheelRemainSpinNumberObj = useMode2RechargeWheelPageStore(
    (state) => state.setWheelRemainSpinNumberObj
  );

  useEffect(() => {
    if (isLogin) triggerPostWheelPlayerProgress();
  }, [postPlayerProgressCount, isLogin]);

  useDeepEffect(() => {
    if (isPostWheelPlayerProgressSuccess && WheelPlayerProgressData) {
      //   console.log('@@ WheelPlayerProgressData', WheelPlayerProgressData);

      //  取出 currentDeposit 並且設置
      const currentDeposit = get(WheelPlayerProgressData, 'currentDeposit', 0);

      setCurrentDeposit(currentDeposit);

      // 取出各個輪盤剩餘次數
      const spinProgressArr = get(WheelPlayerProgressData, 'spinProgress', []);

      const spinProgressObjFromAPI = !isEmpty(spinProgressArr)
        ? spinProgressArr.reduce((acc, cur) => {
            const keyName = rechargeWheelLevelTypeMapping[cur.wheelLevel];

            return {
              ...acc,
              [keyName]: cur.remainingSpins,
            };
          }, {})
        : {};

      setWheelRemainSpinNumberObj(spinProgressObjFromAPI);
    }
  }, [WheelPlayerProgressData, isPostWheelPlayerProgressSuccess]);
};

export default useRechargeWheelPlayerProgress;
