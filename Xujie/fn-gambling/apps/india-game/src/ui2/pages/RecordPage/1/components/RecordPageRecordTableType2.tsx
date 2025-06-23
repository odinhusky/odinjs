// import { useTranslation } from 'react-i18next';
// import { message } from 'antd';
// import {
//   EResourceLevel,
//   formatNumber,
//   getImgUrl,
//   formatDate,
// } from '@mode2/utils';
// import { RechargeRecordStatus } from '@mode2API/endpoint/record/PostRechargeRecordsEndpoint';
// import { WithdrawRecordStatus } from '@mode2API/endpoint/record/PostWithdrawRecordsEndpoint';
// import { handleRecordPageCopyOrderNumberClick } from '@mode2/action/actionTypes';
// import { useRecordPageActions } from '@mode2/action/recordPageAction/useRecordPageActions';
// import useDeepEffect from '@libs/commonUtils/hooks/useDeepEffect';
// import { ClipboardState } from '@libs/commonUtils/hooks/useClipboard';
// import { useRecordPageBalanceRecordStore } from '@mode2/zustand/page/recordPageStore';
// import { cx } from '@libs/commonUtils/cx';
//
// interface RecordListItem {
//   amount: number;
//   orderNumber: string;
//   status: number;
//   timestamp: number;
// }
//
// interface RecordTableType2DataProps {
//   recordList: RecordListItem[];
//   tableType: 'recharge' | 'withdraw';
// }
// const RecordPageRecordTableType2 = (props: RecordTableType2DataProps) => {
//   const { t } = useTranslation();
//   const { handleRecordPageClick } = useRecordPageActions();
//
//   const clipboardResult = useRecordPageBalanceRecordStore(
//     (state) => state.clipboardResult
//   );
//
//   const renderStatusText = (status: number) => {
//     if (props.tableType === 'recharge') {
//       switch (status) {
//         case RechargeRecordStatus.SUCCESS:
//           return t(
//             'account_balance_record_add_cash_record_table_content_success'
//           );
//         case RechargeRecordStatus.FAIL:
//           return t('account_balance_record_add_cash_record_table_content_fail');
//         default:
//           return '';
//       }
//     } else if (props.tableType === 'withdraw') {
//       switch (status) {
//         case WithdrawRecordStatus.PROCESSING:
//           return t(
//             'account_balance_record_add_cash_record_table_content_processing'
//           );
//         default:
//           return '';
//       }
//     }
//     return '';
//   };
//
//   const renderItemHeader = ({
//     timestamp,
//     amount,
//     status,
//   }: Pick<RecordListItem, 'timestamp' | 'amount' | 'status'>) => {
//     let statusColorClass = '';
//     const successTextClass = 'text-[#63CF30]';
//     const processingTextClass =
//       'bg-clip-text text-transparent bg-gradient-to-b from-[#FFA441] to-[#FE8B34]';
//     const failTextClass = 'text-[#F83B3A]';
//     if (
//       props.tableType === 'recharge' &&
//       status === RechargeRecordStatus.SUCCESS
//     ) {
//       statusColorClass = successTextClass;
//     } else if (
//       props.tableType === 'withdraw' &&
//       status === WithdrawRecordStatus.PROCESSING
//     ) {
//       statusColorClass = processingTextClass;
//     } else if (
//       props.tableType === 'recharge' &&
//       status === RechargeRecordStatus.FAIL
//     ) {
//       statusColorClass = failTextClass;
//     }
//
//     return (
//       <div className="bgi-[var(--grayscale-15)] grid grid-cols-3 p-1 gap-1 mobile:p-3 mobile:gap-3">
//         <div className={cx(itemClassName, 'text-center')}>
//           {formatDate(timestamp)}
//         </div>
//         <div className={itemClassName}>
//           <Icon
//             className="h-4 w-4 mobile:h-6 mobile:w-6"
//             name='ic_inr'
//           />
//           <span className={statusColorClass}>
//             {formatNumber(amount, props.tableType === 'recharge')}
//           </span>
//         </div>
//         <div className={cx(itemClassName, statusColorClass)}>
//           {renderStatusText(status)}
//         </div>
//       </div>
//     );
//   };
//
//   const renderOrderNumberArea = ({
//     orderNumber,
//   }: Pick<RecordListItem, 'orderNumber'>) => {
//     return (
//       <div className="flex w-full items-center gap-2">
//         <Icon
//           className="h-6 w-6 mobile:h-9 mobile:w-9"
//          name='ic_deposit'
//           color="var(--grayscale-70)"
//         />
//         <div className="flex flex-wrap mobile:flex-nowrap text-xs font-normal mobile:font-medium mobile:text-base">
//           <span>
//             {t(
//               'account_balance_record_add_cash_record_table_content_order_number'
//             )}
//           </span>
//           <span>{orderNumber}</span>
//         </div>
//       </div>
//     );
//   };
//
//   const renderCopyButton = ({
//     orderNumber,
//   }: Pick<RecordListItem, 'orderNumber'>) => {
//     return (
//       <button
//         className="flex gap-1 justify-center items-center font-medium text-[24px] mobile:flex-row mobile:text-xs flex-col mobile:flex-row"
//         onClick={() => {
//           handleRecordPageClick({
//             actionName: handleRecordPageCopyOrderNumberClick,
//             payload: {
//               text: orderNumber,
//             },
//           });
//         }}
//       >
//         <Icon
//           className="h-5 w-5 mobile:h-6 mobile:w-6"
//           name='ic_copy'
//         />
//         <span className="text-xs font-medium mobile:text-sm">
//           {t('account_balance_record_add_cash_record_btn_copy')}
//         </span>
//       </button>
//     );
//   };
//
//   const itemClassName = 'flex items-center justify-center gap-1';
//   return (
//     <div className="overflow-y-auto max-h-[576px] mt-2 mobile:mt-3 tablet:mt-4 ">
//       <div className="flex flex-col gap-2 bgi-text-[var(--grayscale-70)] text-xs font-normal mobile:gap-3 mobile:text-base mobile:font-medium tablet:gap-4">
//         {props.recordList.map((data, index) => {
//           return (
//             <div
//               key={index}
//               className="flex flex-col rounded-[4px] overflow-hidden shadow-[4px_4px_8px_#00000040]"
//             >
//               {renderItemHeader({
//                 timestamp: data.timestamp,
//                 amount: data.amount,
//                 status: data.status,
//               })}
//
//               <div className="flex bgi-[var(--grayscale-25)] justify-between py-1 px-2 items-center mobile:py-3 mobile:px-6 mobile:gap-3">
//                 {renderOrderNumberArea({ orderNumber: data.orderNumber })}
//                 {renderCopyButton({ orderNumber: data.orderNumber })}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };
//
// export default RecordPageRecordTableType2;
