import { useEffect, useMemo } from 'react';
import {
  useGetGlobalConfigQuery,
  useLazyGetUserDamaProcessQuery,
} from '../../external';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxStore';

type DamaResult = {
  isShowDama: boolean; // 是否顯示
  progressText: string; // 打碼進度 百分比
  progressValue: number; // 進度條顯示 max=1.0 min=0.0
};

const defResult = {
  isShowDama: false,
  progressText: '',
  progressValue: 0,
};
export const useUserDama = () => {
  const { data: configData, isUninitialized: isConfigUninitialized } =
    useGetGlobalConfigQuery(null);
  const [triggerUserDama, { data: damaProcess, isUninitialized }] =
    useLazyGetUserDamaProcessQuery();
  const isLogin = useSelector((state: RootState) => state.app.isLogin);

  const trigger = async () => {
    triggerUserDama(null);
  };

  useEffect(() => {
    if (isLogin) {
      triggerUserDama(null);
    }
  }, [isLogin]);

  const damaResult: DamaResult = useMemo(() => {
    if (isConfigUninitialized) return defResult;

    let isShowDama = configData?.data?.dama_process || false;

    // 顯示打碼進度關閉，給預設不顯示
    if (!isShowDama) return defResult;

    // 無回應任何資料，給預設不顯示
    if (!damaProcess?.data && !isUninitialized) return defResult;

    let damaResponse = damaProcess?.data;

    // 顯示打碼進度開啟，沒資料，給預設不顯示
    if (!damaResponse) return defResult;

    // mock code
    // let process = 0.55
    let process = damaResponse.process || 0.0;

    return {
      isShowDama: isShowDama,
      progressText: `${(process * 100).toFixed(2)} %`,
      progressValue: process,
    };
  }, [configData, damaProcess]);

  return {
    trigger,
    damaResult,
  };
};
