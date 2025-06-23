import {
  handleRecordPageCopyOrderNumberClick,
  handleRecordPageDesktopHeaderBackBtnClick,
  handleRecordPageToFullOrderPageClick,
  handleRecordPageReportProgressClick,
  handleRecordPageReportTabClick,
  handleRecordPageSwitchRecordListTabClick,
  handleRecordPageTabClick,
  handleRecordPageHeaderTabIndexClick,
} from '@mode2/action/actionTypes';

import handleGlobalClick from '../handleGlobalClick';
import {
  RecordPageHeaderTabs,
  RecordPageReportSelectedProgressInfoUnit,
  RecordPageReportTimeTabs,
  RecordPageTabs,
  useRecordPageBalanceRecordStore,
  useRecordPageBalanceReportStore,
  useRecordPageHeaderTabsStore,
  useRecordPageStore,
} from '@mode2/zustand/page/recordPageStore';
import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import handleAction from '../common/handleAction';
import { useClipboard } from '@libs/commonUtils/hooks/useClipboard';
import { useEffect } from 'react';
import {
  useNavigateClick,
  useNavPageClick,
} from '@mode2/usecase/useNavPageClick';
import { INV6 } from '@libs/constant/versions';

type ActionClickPayloadMap = {
  [handleRecordPageTabClick]: { index: RecordPageTabs };
  [handleRecordPageHeaderTabIndexClick]: { index: RecordPageHeaderTabs };
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

  const setHeaderTabIndex = useRecordPageHeaderTabsStore(
    (state) => state.setHeaderTabIndex
  );

  useEffect(() => {
    setClipboardResult(clipboard);
  }, [clipboard]);

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleRecordPageTabClick]: ({ index }) => {
      handleGlobalClick({
        target: handleRecordPageTabClick,
        payload: { index },
        callback: () => {
          setTabIndex(index);
        },
      });
    },
    [handleRecordPageSwitchRecordListTabClick]: ({ index }) => {
      handleGlobalClick({
        target: handleRecordPageSwitchRecordListTabClick,
        payload: { index },
        callback: () => {
          setActiveListSwitchTabIndex(index);
        },
      });
    },
    [handleRecordPageReportTabClick]: ({ index }) => {
      handleGlobalClick({
        target: handleRecordPageReportTabClick,
        payload: { index },
        callback: () => {
          setActiveReportTimeTabIndex(index);
        },
      });
    },
    [handleRecordPageReportProgressClick]: ({ progressInfo }) => {
      handleGlobalClick({
        target: handleRecordPageReportProgressClick,
        payload: { progressInfo },
        callback: () => {
          setSelectProgressInfo(progressInfo);
        },
      });
    },
    [handleRecordPageCopyOrderNumberClick]: ({ text }) => {
      handleGlobalClick({
        target: handleRecordPageCopyOrderNumberClick,
        payload: { text },
        callback: () => {
          copyToClipboard(text, {
            successMessage:
              import.meta.env['VITE_V_VERSION'] === INV6
                ? 'spin_and_share_wheel_copied_toast'
                : '',
            resetInterval: 100,
          });
        },
        debounceTimer: 300,
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
        payload: { value },
        callback: () => {
          navToFullOrderDetailPage('', { state: { orderId: value } });
        },
      });
    },
    [handleRecordPageHeaderTabIndexClick]: ({ index }) => {
      handleGlobalClick({
        target: handleRecordPageHeaderTabIndexClick,
        payload: { index },
        callback: () => {
          setHeaderTabIndex(index);
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
