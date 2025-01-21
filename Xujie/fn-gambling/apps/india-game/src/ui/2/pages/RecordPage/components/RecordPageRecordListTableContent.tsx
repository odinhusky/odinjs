// import { RecordPageBalanceRecordTabs, useRecordPageBalanceRecordStore } from '@mode2/zustand/page/recordPageStore';
// import RecordPageRecordTransferTable from './RecordPageRecordTransferTable';
// import RecordPageRecordRechargeTable from './RecordPageRecordRechargeTable';
// import RecordPageRecordWithdrawalTable from './RecordPageRecordWithdrawalTable';
//
// export const RecordPageRecordListTableContent = () => {
//   const activeListSwitchTabIndex = useRecordPageBalanceRecordStore(
//     (state) => state.activeListSwitchTabIndex
//   );
//
//   if (
//     activeListSwitchTabIndex ===
//     RecordPageBalanceRecordTabs.FUND_TRANSFER_RECORD
//   ) {
//     return <RecordPageRecordTransferTable />;
//   } else if (
//     activeListSwitchTabIndex === RecordPageBalanceRecordTabs.ADD_CASH_RECORD
//   ) {
//     return (
//       <RecordPageRecordRechargeTable />
//     );
//   } else if (
//     activeListSwitchTabIndex === RecordPageBalanceRecordTabs.WITHDRAWALS_RECORD
//   ) {
//     return (
//       <RecordPageRecordWithdrawalTable />
//     );
//   } else {
//     return null;
//   }
// };
//
// export default RecordPageRecordListTableContent;
