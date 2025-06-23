import { useDeepEffect } from '@libs/commonUtils';
import { rechargeWheelLevelTypeMapping } from '@libs/mode2/@types/rechargeWheelLevelTypes';
import { usePostWheelConfigMutation } from '@libs/mode2/external/api';
import { useRechargeWheelTabStore } from '@libs/mode2/zustand/components/rechargeWheelTabStore';
import useMode2RechargeWheelPageStore, {
  WheelLevelConfigObjType,
  WheelProgressConfigObjType,
} from '@libs/mode2/zustand/page/rechargeWheelPage';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
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

      /**
       * 充值輪盤有四個等級，最後一個等級未開啟
       * 加上 currentWheel === 4 ? 3 : currentWheel 是為了規避掉 每次進入頁面會閃現4 ===> 3的情況(QA提的)
       */
      const rechareWheelCount = Object.values(
        rechargeWheelLevelTypeMapping
      ).length;

      const index =
        currentWheel === rechareWheelCount
          ? rechareWheelCount - 1
          : currentWheel;

      const shouldActiveTab = rechargeWheelLevelTypeMapping[index] || 'silver';

      console.log('@@@===> rechareWheelLevel', currentWheel, shouldActiveTab, rechareWheelCount);

      setActiveRechargeActiveTab(shouldActiveTab);
    }
  }, [isPostWheelConfigSuccess, wheelConfigData, currentDeposit]);
};

export default useRechargeWheelPageConfig;
