import {
  handleRankingHistoryModalCloseButtonClick,
  handleRankingHistoryModalTabClick,
} from './actionType';
import { HandleClickProps } from '../common/handleClickProps';
import { ActionClickObjType } from '../common/actionClickObjetType';
import handleGlobalClick from '../handleGlobalClick';
import handleAction from '../common/handleAction';
import { useRankingRewardsHistoryModalStore } from '@mode2/zustand/page/RankingPage/rankingRewardsHistoryModalStore';
import { RankingHistoryType } from '@mode2API/endpoint/ranking/PostRankingHistoryEndpoint';

type ActionClickPayloadMap = {
  [handleRankingHistoryModalCloseButtonClick]: void;
  [handleRankingHistoryModalTabClick]: {
    tab: RankingHistoryType;
  };
};

export interface RankingHistoryModalClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useRankingHistoryModalAction = () => {
  const setRewardsHistoryTab = useRankingRewardsHistoryModalStore(
    (state) => state.setRewardsHistoryTab
  );
  const setShowRankingRewardsHistoryModal = useRankingRewardsHistoryModalStore(
    (state) => state.setShowRankingRewardsHistoryModal
  );

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleRankingHistoryModalCloseButtonClick]: () => {
      handleGlobalClick({
        target: handleRankingHistoryModalCloseButtonClick,
        callback: () => {
          setShowRankingRewardsHistoryModal(false);
        },
      });
    },
    [handleRankingHistoryModalTabClick]: ({ tab }) => {
      handleGlobalClick({
        target: handleRankingHistoryModalTabClick,
        payload: { tab },
        callback: () => {
          setRewardsHistoryTab(tab);
        },
      });
    },
  };

  const handleRankingHistoryModalClick = <
    T extends keyof ActionClickPayloadMap
  >({
    actionName,
    payload,
  }: RankingHistoryModalClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleRankingHistoryModalClick,
  };
};

export default useRankingHistoryModalAction;
