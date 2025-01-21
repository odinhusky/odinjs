import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  useRecordPageBalanceRecordStore,
  useRecordPageStore,
  useRecordPageBalanceReportStore,
  RecordPageTabs,
  RecordPageBalanceRecordTabs,
  RecordPageReportTimeTabs,
} from '@mode2/zustand/page/recordPageStore';
import { getParams } from '@libs/mode2/utils';

const useRecordPageTabNavigator = () => {
  const location = useLocation();

  const setTabIndex = useRecordPageStore((state) => state.setTabIndex);
  const setActiveListSwitchTabIndex = useRecordPageBalanceRecordStore(
    (state) => state.setActiveListSwitchTabIndex
  );
  const setActiveReportTimeTabIndex = useRecordPageBalanceReportStore(
    (state) => state.setActiveReportTimeTabIndex
  );

  useEffect(() => {
    const params = getParams(['subTab', 'tab'], location.search, location.state);
    console.log('@@==> params', params);

    const { tab, subTab } = params || location.state || {};
    if (tab !== undefined) {
      setTabIndex(tab as number);
    }
    if (subTab !== undefined) {
      setActiveListSwitchTabIndex(subTab as number);
    }

    return () => {
      setTabIndex(RecordPageTabs.RECORD);
      setActiveListSwitchTabIndex(
        RecordPageBalanceRecordTabs.FUND_TRANSFER_RECORD
      );
      setActiveReportTimeTabIndex(RecordPageReportTimeTabs.TODAY);
    };
  }, [location]);
};

export default useRecordPageTabNavigator;
