import {
  handleWalletGuidePageRewardsButtonClickAction,
  handleWalletGuidePageTabSelected,
} from '@mode2/action/actionTypes';

import handleGlobalClick from '../handleGlobalClick';

import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import handleAction from '../common/handleAction';
import { WalletGuideTutorialsType } from '@mode2/@types/walletGuideTutorialsType';
import { useWalletGuidePageStore } from '@mode2/zustand/page/WalletGuidePage/useWalletGuidePageStore';
import useTutorialReward from '@libs/mode2/usecase/wallet/useTutorialReward';

type ActionClickPayloadMap = {
  [handleWalletGuidePageTabSelected]: { tab: WalletGuideTutorialsType };
  [handleWalletGuidePageRewardsButtonClickAction]: void;
};

export interface HandleWalletGuidePageClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useWalletGuidePageActions = () => {
  const setTutorialsTab = useWalletGuidePageStore(
    (state) => state.setTutorialsTab
  );

  const { claimReward } = useTutorialReward();

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleWalletGuidePageTabSelected]: ({ tab }) => {
      handleGlobalClick({
        target: handleWalletGuidePageTabSelected,
        payload: { tab },
        callback: () => {
          setTutorialsTab(tab);
        },
      });
    },
    [handleWalletGuidePageRewardsButtonClickAction]: () => {
      handleGlobalClick({
        target: handleWalletGuidePageRewardsButtonClickAction,
        callback: () => {
          // TODO Evan check 領取 支付影片教學獎勵會用到，影片教學暫時已隱藏
          // 2025/04/28 確認要打開此功能
          claimReward();
        },
      });
    },
  };

  const handleWalletGuidePageClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleWalletGuidePageClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleWalletGuidePageClick,
  };
};

export default useWalletGuidePageActions;
