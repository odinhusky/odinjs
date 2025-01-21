import { RecordPageBalanceRecordTabs, useRecordPageBalanceRecordStore } from '@mode2/zustand/page/recordPageStore';
import RecordPageRecordListTableHead from './RecordPageRecordListTableHead';
import { cx } from '@libs/commonUtils/cx';
import RecordPageRecordTransferTable from '@pages/RecordPage/components/RecordPageRecordTransferTable';
import RecordPageRecordRechargeTable from '@pages/RecordPage/components/RecordPageRecordRechargeTable';
import RecordPageRecordWithdrawalTable from '@pages/RecordPage/components/RecordPageRecordWithdrawalTable';

export const RecordPageRecordListTable = () => {

  const activeListSwitchTabIndex = useRecordPageBalanceRecordStore(
    (state) => state.activeListSwitchTabIndex
  );

  return (
    <>
      {/* 表格 */}
      <div
        className={cx('tablet:mb-16 mb-0', {
          'gap-4 rounded bgi-[var(--grayscale-20)] p-3 mobile:px-6 tablet:p-6':
            activeListSwitchTabIndex !== 0
        })}
      >
        <RecordPageRecordListTableHead />

        {activeListSwitchTabIndex === RecordPageBalanceRecordTabs.FUND_TRANSFER_RECORD ?
          <RecordPageRecordTransferTable /> : null}
        {activeListSwitchTabIndex === RecordPageBalanceRecordTabs.ADD_CASH_RECORD ?
          <RecordPageRecordRechargeTable /> : null}
        {activeListSwitchTabIndex === RecordPageBalanceRecordTabs.WITHDRAWALS_RECORD ?
          <RecordPageRecordWithdrawalTable /> : null}

      </div>
    </>
  );
};

export default RecordPageRecordListTable;
