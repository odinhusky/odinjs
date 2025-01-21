import { useDeepEffect } from '@libs/commonUtils';
import { rechargeWheelLevelTypeMapping } from '@libs/mode2/@types/rechargeWheelLevelTypes';
import { usePostWheelConfigMutation } from '@libs/mode2/external/api';
import { useRechargeWheelTabStore } from '@libs/mode2/zustand/components/rechargeWheelTabStore';
import useMode2RechargeWheelPageStore, {
  WheelLevelConfigObjType,
  WheelProgressConfigObjType,
} from '@libs/mode2/zustand/page/rechargeWheelPage';
import { cloneDeep, get, isEmpty } from 'lodash';
import { useEffect } from 'react';

export const useRechargeWheelPageConfig = () => {
  const [
    triggerPostWheelConfig,
    { data: wheelConfigData, isSuccess: isPostWheelConfigSuccess },
  ] = usePostWheelConfigMutation();

  const currentDeposit = useMode2RechargeWheelPageStore(
    (state) => state.currentDeposit
  );

  const setRechargeWheelMaxReward = useMode2RechargeWheelPageStore(
    (state) => state.setRechargeWheelMaxReward
  );

  const setWheelLevelConfigObj = useMode2RechargeWheelPageStore(
    (state) => state.setWheelLevelConfigObj
  );

  const setProgressConfigObj = useMode2RechargeWheelPageStore(
    (state) => state.setProgressConfigObj
  );

  const setActiveRechargeActiveTab = useRechargeWheelTabStore(
    (state) => state.setActiveRechargeActiveTab
  );

  useEffect(() => {
    triggerPostWheelConfig();
  }, []);

  useDeepEffect(() => {
    if (isPostWheelConfigSuccess && wheelConfigData) {
      // 設定最大獎勵
      const maxReward = get(wheelConfigData, 'rechargeWheelMaxReward', 0);

      setRechargeWheelMaxReward(maxReward);

      // 輪盤 config 相關
      const levelConfigs = get(wheelConfigData, 'levelConfigs', []);

      const obj: WheelLevelConfigObjType | {} = !isEmpty(levelConfigs)
        ? levelConfigs.reduce((acc, cur) => {
            const keyName = rechargeWheelLevelTypeMapping[cur.wheelLevel];

            return {
              ...acc,
              [keyName]: {
                maxReward: cur.maxReward,
                wheelSegments: [...cloneDeep(cur.wheelSegments)],
              },
            };
          }, {})
        : {};

      setWheelLevelConfigObj(obj);

      // progress config 相關
      const progressConfigs = get(wheelConfigData, 'progressConfigs', []);

      const progressConfigObj: WheelProgressConfigObjType | {} = !isEmpty(
        progressConfigs
      )
        ? progressConfigs.reduce((acc, cur) => {
            const keyName = rechargeWheelLevelTypeMapping[cur.wheelLevel];

            return {
              ...acc,
              [keyName]: {
                maxRequiredReward: cur.maxRequiredReward,
                anchorPointList: [...cloneDeep(cur.anchorPointList)],
              },
            };
          }, {})
        : {};

      setProgressConfigObj(progressConfigObj);

      // 找出目前 deposit 的進度，並且設置 activeTab
      const currentWheel =
        progressConfigs.find((item) => item.maxRequiredReward > currentDeposit)
          ?.wheelLevel || 1;

      const shouldActiveTab =
        rechargeWheelLevelTypeMapping[currentWheel] || 'silver';

      setActiveRechargeActiveTab(shouldActiveTab);
    }
  }, [isPostWheelConfigSuccess, wheelConfigData, currentDeposit]);
};

export default useRechargeWheelPageConfig;
