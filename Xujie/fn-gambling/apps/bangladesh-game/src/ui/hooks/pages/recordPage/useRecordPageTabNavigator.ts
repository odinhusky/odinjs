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
    const { tab, subTab } = location.state || {};
    if (tab !== undefined) {
      setTabIndex(tab);
    }
    if (subTab !== undefined) {
      setActiveListSwitchTabIndex(subTab);
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
