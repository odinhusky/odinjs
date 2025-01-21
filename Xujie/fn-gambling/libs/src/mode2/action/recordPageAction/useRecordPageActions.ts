import {
  handleRecordPageCopyOrderNumberClick,
  handleRecordPageDesktopHeaderBackBtnClick,
  handleRecordPageToFullOrderPageClick,
  handleRecordPageReportProgressClick,
  handleRecordPageReportTabClick,
  handleRecordPageSwitchRecordListTabClick,
  handleRecordPageTabClick,
} from './acitonType';

import handleGlobalClick from '../handleGlobalClick';
import {
  RecordPageReportSelectedProgressInfoUnit,
  RecordPageReportTimeTabs,
  RecordPageTabs,
  useRecordPageBalanceRecordStore,
  useRecordPageBalanceReportStore,
  useRecordPageStore,
} from '@mode2/zustand/page/recordPageStore';
import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import handleAction from '../common/handleAction';
import { useClipboard } from '@libs/commonUtils/hooks/useClipboard';
import { useEffect } from 'react';
import { useNavigateClick, useNavPageClick } from '@mode2/usecase/useNavPageClick';

type ActionClickPayloadMap = {
  [handleRecordPageTabClick]: { index: RecordPageTabs };
  [handleRecordPageSwitchRecordListTabClick]: { index: number };
  [handleRecordPageReportTabClick]: { index: RecordPageReportTimeTabs };
  [handleRecordPageReportProgressClick]: {
    progressInfo: RecordPageReportSelectedProgressInfoUnit;
  };
  [handleRecordPageCopyOrderNumberClick]: {
    text: string;
  };
  [handleRecordPageDesktopHeaderBackBtnClick]: void;
  [handleRecordPageToFullOrderPageClick]: {
    value: string;
  };
};

export interface HandleRecordPageClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useRecordPageActions = () => {
  const { clipboard, copyToClipboard } = useClipboard();
  const { navToFullOrderDetailPage } = useNavPageClick();
  const navigate = useNavigateClick();

  const setTabIndex = useRecordPageStore((state) => state.setTabIndex);

  const setActiveListSwitchTabIndex = useRecordPageBalanceRecordStore(
    (state) => state.setActiveListSwitchTabIndex
  );

  const setClipboardResult = useRecordPageBalanceRecordStore(
    (state) => state.setClipboardResult
  );

  const setActiveReportTimeTabIndex = useRecordPageBalanceReportStore(
    (state) => state.setActiveReportTimeTabIndex
  );

  const setSelectProgressInfo = useRecordPageBalanceReportStore(
    (state) => state.setSelectProgressInfo
  );

  useEffect(() => {
    setClipboardResult(clipboard);
  }, [clipboard]);

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleRecordPageTabClick]: ({ index }) => {
      handleGlobalClick({
        target: handleRecordPageTabClick,
        callback: () => {
          setTabIndex(index);
        },
      });
    },
    [handleRecordPageSwitchRecordListTabClick]: ({ index }) => {
      handleGlobalClick({
        target: handleRecordPageSwitchRecordListTabClick,
        callback: () => {
          // TODO 刷新列表
          setActiveListSwitchTabIndex(index);
        },
      });
    },
    [handleRecordPageReportTabClick]: ({ index }) => {
      handleGlobalClick({
        target: handleRecordPageReportTabClick,
        callback: () => {
          setActiveReportTimeTabIndex(index);
        },
      });
    },
    [handleRecordPageReportProgressClick]: ({ progressInfo }) => {
      handleGlobalClick({
        target: handleRecordPageReportProgressClick,
        callback: () => {
          setSelectProgressInfo(progressInfo);
        },
      });
    },
    [handleRecordPageCopyOrderNumberClick]: ({ text }) => {
      handleGlobalClick({
        target: handleRecordPageCopyOrderNumberClick,
        callback: () => {
          copyToClipboard(text);
        },
      });
    },
    [handleRecordPageDesktopHeaderBackBtnClick]: () => {
      handleGlobalClick({
        target: handleRecordPageDesktopHeaderBackBtnClick,
        callback: () => {
          navigate(-1);
        },
      });
    },
    [handleRecordPageToFullOrderPageClick]: ({ value }) => {
      handleGlobalClick({
        target: handleRecordPageToFullOrderPageClick,
        callback: () => {
          navToFullOrderDetailPage('', { state: { orderId: value } });
        },
      });
    },
  };

  const handleRecordPageClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleRecordPageClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleRecordPageClick,
  };
};

export default useRecordPageActions;
