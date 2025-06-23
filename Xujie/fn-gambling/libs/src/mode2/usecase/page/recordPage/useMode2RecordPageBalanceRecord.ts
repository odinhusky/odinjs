import { useDeepEffect } from '@commonUtils/hooks';
import {
  useRecordPageBalanceRecordStore,
  RecordPageBalanceRecordTabs,
} from '@mode2/zustand/page/recordPageStore';
import { useEffect } from 'react';
import {
  usePostFundDetailMutation,
  usePostRechargeRecordsMutation,
  usePostWithdrawRecordsMutation,
} from '@mode2API/index';

export const useMode2RecordPageBalanceRecord = () => {
  // - 上方切換的 Switch tab list
  const setListSwitchTabList = useRecordPageBalanceRecordStore(
    (state) => state.setListSwitchTabList
  );
  const setFundTransferRecords = useRecordPageBalanceRecordStore(
    (state) => state.setFundTransferRecords
  );
  const setRechargeRecords = useRecordPageBalanceRecordStore(
    (state) => state.setRechargeRecords
  );
  const setWthdrawRecords = useRecordPageBalanceRecordStore(
    (state) => state.setWthdrawRecords
  );

  const activeListSwitchTabIndex = useRecordPageBalanceRecordStore(
    (state) => state.activeListSwitchTabIndex
  );

  const [triggerFetchFundTransterRecord, { data: fundTransferData }] =
    usePostFundDetailMutation();
  const [postRechargeRecords, { data: rechargeRecordData }] =
    usePostRechargeRecordsMutation();
  const [postWithdrawRecords, { data: withdrawRecordData }] =
    usePostWithdrawRecordsMutation();

  useEffect(() => {
    const listTabs = [
      {
        i18nKey:
          'account_balance_record_fund_transfer_records_tab_fund_transfer_records',
      },
      {
        i18nKey:
          'account_balance_record_fund_transfer_records_tab_add_cash_record',
      },
      {
        i18nKey:
          'account_balance_record_fund_transfer_records_tab_withdrawals_record',
      },
    ];

    setListSwitchTabList(listTabs);
  }, []);

  useDeepEffect(() => {
    if (fundTransferData) {
      setFundTransferRecords(fundTransferData);
    }
  }, [fundTransferData]);

  useDeepEffect(() => {
    if (rechargeRecordData) {
      setRechargeRecords(rechargeRecordData.rechargeRecords);
    }
  }, [rechargeRecordData]);

  useDeepEffect(() => {
    if (withdrawRecordData) {
      setWthdrawRecords(withdrawRecordData.withdrawRecords);
    }
  }, [withdrawRecordData]);

  useEffect(() => {
    if (
      activeListSwitchTabIndex ===
      RecordPageBalanceRecordTabs.FUND_TRANSFER_RECORD
    ) {
      triggerFetchFundTransterRecord({ page: 1, limit: 30 });
    } else if (
      activeListSwitchTabIndex === RecordPageBalanceRecordTabs.ADD_CASH_RECORD
    ) {
      postRechargeRecords({ page: 1, limit: 1000 });
    } else if (
      activeListSwitchTabIndex ===
      RecordPageBalanceRecordTabs.WITHDRAWALS_RECORD
    ) {
      postWithdrawRecords({ page: 1, limit: 30 });
    }
  }, [activeListSwitchTabIndex]);
};

export default useMode2RecordPageBalanceRecord;
