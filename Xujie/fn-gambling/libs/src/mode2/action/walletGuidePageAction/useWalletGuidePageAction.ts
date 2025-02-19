import {
  handleWalletGuidePageRewardsButtonClickAction,
  handleWalletGuidePageTabSelected,
} from './acitonType';

import handleGlobalClick from '../handleGlobalClick';

import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import handleAction from '../common/handleAction';
import { WalletGuideTutorialsType } from '@mode2/@types/walletGuideTutorialsType';
import { useWalletGuidePageStore } from '@mode2/zustand/page/WalletGuidePage/useWalletGuidePageStore';

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

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleWalletGuidePageTabSelected]: ({ tab }) => {
      handleGlobalClick({
        target: handleWalletGuidePageTabSelected,
        callback: () => {
          setTutorialsTab(tab);
        },
      });
    },
    [handleWalletGuidePageRewardsButtonClickAction]: () => {
      handleGlobalClick({
        target: handleWalletGuidePageRewardsButtonClickAction,
        callback: () => {
          // TODO Evan 領取任務獎勵
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
