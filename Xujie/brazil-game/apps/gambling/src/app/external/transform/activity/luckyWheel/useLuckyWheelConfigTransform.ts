// # API
import {
  useGetLuckyWheelConfigQuery,
} from "apps/gambling/src/app/external";

import { useState } from "react";
import useDeepEffect from "apps/gambling/src/app/ui/hooks/useDeepEffect";

// - default value
import luckyWheelConfigDefault from "./default/luckyWheelConfigDefault";

// ? types
import { LuckyWheelConfigsType, LevelType, LuckyWheelUnit } from "../../../endpoint/activity/luckyWheel/PostLuckyWheelSpinEndpoint";

export type SwitchWheelBtnType = {
  id?: string;
  level?: LevelType;
  perSpinCost?: number;
};

export type WheelConfigsType = {
  id?: string;
  level?: LevelType;
  rewardConfigs?: LuckyWheelUnit[];
};

// ^ plugins
import { get, isEmpty } from "lodash";

export const useLuckyWheelConfigTransform = () => {
  // Lucky Wheel Congig
  const { configData, refetch: refetchConfig } = useGetLuckyWheelConfigQuery({}, {
    selectFromResult: (data) => {
      return {
        ...data,
        configData: data?.data?.data
      }
    }
  });
  const [content, setContent] = useState('');
  const [dama, setDama] = useState(0);
  const [currentLuckyValue, setCurrentLuckyValue] = useState(1);
  const [luckValue, setLuckyValue] = useState(2);
  const [luckyWheelConfigs, setLuckyWheelConfigs] = useState<LuckyWheelConfigsType[]>(() => luckyWheelConfigDefault);

  const [switchWheelBtns, setSwitchWheelBtns] = useState<SwitchWheelBtnType[]>();
  const [wheelConfigs, setWheelConfigs] = useState<WheelConfigsType[]>();

  useDeepEffect(() => {
    if(configData && !isEmpty(configData)) {
      setContent(configData?.content || '');
      setDama(configData?.dama || 0);
      setCurrentLuckyValue(configData?.currentLuckyValue || 0);
      setLuckyValue(configData?.luckValue || 0);

      const luckyWheelConfigsResult = get(configData, 'luckyWheelConfigs', []);

      // console.log('@@ luckyWheelConfigs', luckyWheelConfigsResult);
      setLuckyWheelConfigs(luckyWheelConfigsResult);

      // 切換輪盤的按鈕資料以及輪盤的Config
      if(luckyWheelConfigsResult.length > 0) {
        const btns = luckyWheelConfigsResult.map(item => {

          return {
            id: item.level,
            level: item.level,
            perSpinCost: item.perSpinCost
          }
        });

        setSwitchWheelBtns(btns);

        const wheels = luckyWheelConfigsResult.map(item => {

          return {
            id: item.level,
            level: item.level,
            rewardConfigs: item.rewardConfigs
          }
        });

        setWheelConfigs(wheels);
      }
    }
  }, [configData]);

  return {
    content,
    dama,
    currentLuckyValue,
    luckValue,
    luckyWheelConfigs, // 全部的 config，包含按鈕資訊
    configData, // 直接從API拿出來的 data
    switchWheelBtns, // 只有按鈕 condig 的陣列
    wheelConfigs, // 只有輪盤的 config 陣列
    refetchConfig
  }
};

export default useLuckyWheelConfigTransform;