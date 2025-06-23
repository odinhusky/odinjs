import {
  handleRankingPageHeaderShareBtnClick,
  handleRankingPageHistoryBtnClick,
  handleRankingPageSummaryPeriodsTabBtnClick,
  handleRankingPageTabClick,
  handleShareSaveImageClick,
} from '@mode2/action/actionTypes';
import { HandleClickProps } from '../common/handleClickProps';
import { ActionClickObjType } from '../common/actionClickObjetType';
import handleGlobalClick from '../handleGlobalClick';
import handleAction from '../common/handleAction';
import {
  RankingPageTabs,
  RankingPeriodsTabs,
  useRankingPageStore,
} from '@mode2/zustand/page/RankingPage/rankingPageStore';
import { useRankingRewardsHistoryModalStore } from '@mode2/zustand/page/RankingPage/rankingRewardsHistoryModalStore';
import { useNavPageClick } from '@libs/mode2/usecase/useNavPageClick';
import { useDownloadSnapshotElement } from '@libs/commonUtils';
import { RefObject } from 'react';
import { useToastStore } from '@libs/mode2/zustand/components/toastStore';

type ActionClickPayloadMap = {
  [handleRankingPageTabClick]: { tab: RankingPageTabs };
  [handleRankingPageSummaryPeriodsTabBtnClick]: { tab: RankingPeriodsTabs };
  [handleRankingPageHeaderShareBtnClick]: { isShowRankingShareModal: boolean };
  [handleRankingPageHistoryBtnClick]: void;
  [handleShareSaveImageClick]: { asImageRef: RefObject<HTMLDivElement> };
};

export interface HandleRankingPageClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useRankingPageActions = () => {
  const { downloadDomAsImage, downloadHtmlAsImage } =
    useDownloadSnapshotElement();
  const setRankingPageTab = useRankingPageStore(
    (state) => state.setRankingPageTab
  );
  const setIsShowRankingShareModal = useRankingPageStore(
    (state) => state.setIsShowRankingShareModal
  );

  const setShowRankingRewardsHistoryModal = useRankingRewardsHistoryModalStore(
    (state) => state.setShowRankingRewardsHistoryModal
  );

  const setRankingSummaryPeriodsActiveTab = useRankingPageStore(
    (state) => state.setRankingSummaryPeriodsActiveTab
  );

  const showToast = useToastStore((state) => state.showToast);

  const { navToRankingPage } = useNavPageClick();

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleRankingPageTabClick]: ({ tab }) => {
      handleGlobalClick({
        target: handleRankingPageTabClick,
        payload: { tab },
        callback: () => {
          setRankingPageTab(tab);
        },
      });
    },
    [handleRankingPageHeaderShareBtnClick]: ({ isShowRankingShareModal }) => {
      handleGlobalClick({
        target: handleRankingPageHeaderShareBtnClick,
        payload: { isShowRankingShareModal },
        callback: () => {
          setIsShowRankingShareModal(isShowRankingShareModal);
        },
      });
    },
    [handleRankingPageHistoryBtnClick]: () => {
      handleGlobalClick({
        target: handleRankingPageHistoryBtnClick,
        callback: () => {
          setShowRankingRewardsHistoryModal(true);
        },
      });
    },
    [handleRankingPageSummaryPeriodsTabBtnClick]: ({ tab }) => {
      handleGlobalClick({
        target: handleRankingPageSummaryPeriodsTabBtnClick,
        payload: { tab },
        callback: () => {
          setRankingSummaryPeriodsActiveTab(tab);
        },
      });
    },
    [handleShareSaveImageClick]: ({ asImageRef }) => {
      handleGlobalClick({
        target: handleShareSaveImageClick,
        callback: async () => {
          // message.loading('Picture loading...');
          await downloadHtmlAsImage(
            asImageRef,
            import.meta.env['VITE_PACKAGENAME']
          );
          // showToast('Picture saved to album');

          // message.destroy();
        },
      });
    },
  };

  const handleRankingPageClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleRankingPageClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleRankingPageClick,
  };
};

export default useRankingPageActions;
