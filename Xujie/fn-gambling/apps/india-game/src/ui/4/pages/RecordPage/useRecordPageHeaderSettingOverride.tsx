import { getParams } from '@libs/mode2/utils';
import {
  EHeaderType,
  useHeaderStore,
} from '@libs/mode2/zustand/components/headerStore';
import {
  RecordPageHeaderTabs,
  useRecordPageBalanceRecordStore,
  useRecordPageHeaderTabsStore,
} from '@libs/mode2/zustand/page/recordPageStore';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { RecordPageRecordHeader } from './components/RecordPageRecordHeader';
import { usePostWithdrawRecordsMutation } from '@libs/mode2/external/api';
import { useDeepEffect } from '@libs/commonUtils';

export const useRecordPageHeaderSettingOverride = () => {
  const setConfig = useHeaderStore((state) => state.setConfig);
  const location = useLocation();
  const setWthdrawRecords = useRecordPageBalanceRecordStore(
    (state) => state.setWthdrawRecords
  );
  const setHeaderTabIndex = useRecordPageHeaderTabsStore(
    (state) => state.setHeaderTabIndex
  );

  // TODO Ronan 暫時先寫在這裡 API
  const headerTabIndex = useRecordPageHeaderTabsStore(
    (state) => state.headerTabIndex
  );
  const [triggerFetchWithdrawRecord, { data: withdrawRecordData }] =
    usePostWithdrawRecordsMutation();

  const params = getParams(['tab'], location.search, location.state);

  useEffect(() => {
    console.log('@@@===> params', params?.tab, headerTabIndex);
    const { tab } = params;
    if (tab !== undefined) {
      setHeaderTabIndex(tab as RecordPageHeaderTabs);
    }
    setConfig({
      type: EHeaderType.Common,
      render: () => {
        return <RecordPageRecordHeader />;
      },
    });
  }, []);

  useDeepEffect(() => {
    if (withdrawRecordData) {
      setWthdrawRecords(withdrawRecordData.withdrawRecords);
    }
  }, [withdrawRecordData]);

  useEffect(() => {
    if (headerTabIndex === RecordPageHeaderTabs.WITHDRAWAL) {
      triggerFetchWithdrawRecord({ page: 1, limit: 30 });
    }
  }, [headerTabIndex]);
};

export default useRecordPageHeaderSettingOverride;
