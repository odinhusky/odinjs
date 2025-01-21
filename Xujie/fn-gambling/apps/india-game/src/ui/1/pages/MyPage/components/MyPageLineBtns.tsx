// import cx from '@commonUtils/cx';
// import renderI18N from '@libs/commonUtils/renderI18N';
// import { formatMoney } from '@mode2/utils';
// import { memo, useMemo } from 'react';
// import { useTranslation } from 'react-i18next';
// import RedDot from '@components/RedDot';
// import { useAppStore } from '@libs/mode2/zustand/appStore';
// import Icon from '@libs/mode2/components/Icon';
// import {
//   handleMyPageActivityLineBtnClick,
//   handleMyPageBankAccountLineBtnClick,
//   handleMyPageChangePasswordLineBtnClick,
//   handleMyPageDepositBtnClick,
//   handleMyPageEarnMoneyLineBtnClick,
//   handleMyPagePersonalInformationLineBtnClick,
//   handleMyPageReloadVersionLineBtnClick,
//   handleMyPageVIPDetailBtnClick,
//   handleMyPageVIPRecordBtnClick,
//   handleMyPageVIPReportBtnClick,
// } from '@libs/mode2/action/myPageAction/acitonType';
// import useMyPageActions from '@libs/mode2/action/myPageAction/useMyPageActions';
// import { InvitePageTabType } from '@libs/mode2/@types/invitePageTabTyp';
// import { useMode2InviteTabStore } from '@libs/mode2/zustand/page/invitePageStore';
//
// export const MyPageLineBtns = memo(() => {
//   const { t } = useTranslation();
//   const { handleMyPageClick } = useMyPageActions();
//   const setInviteCurTab = useMode2InviteTabStore(
//     (state) => state.setInviteCurTab
//   );
//   // const lineBtnList = useMyPageStore((state) => state.lineBtnList);
//   // const lineBtnActionObj = useMyPageActionsStore(
//   //   (state) => state.lineBtnActionObj
//   // );
//   const realTimeH5Version = useAppStore((state) => state.realTimeH5Version);
//   const lineBtnList = useMemo(() => {
//     return [
//       {
//         iconName: 'balance_record',
//         name: {
//           i18nKey:
//             'account_balance_record_fund_transfer_records_header_balance_record',
//         },
//         color: 'var(--grayscale-100)',
//         isBorder: true,
//         isShowRedDot: false,
//         isShowArrow: true,
//         action: () => {
//           handleMyPageClick({
//             actionName: handleMyPageVIPRecordBtnClick,
//           });
//         },
//       },
//       {
//         iconName: 'balance_report',
//         name: { i18nKey: 'account_balance_report_header_balance_report' },
//         color: 'var(--grayscale-100)',
//         isBorder: true,
//         isShowRedDot: false,
//         isShowArrow: true,
//         action: () => {
//           handleMyPageClick({
//             actionName: handleMyPageVIPReportBtnClick,
//           });
//         },
//       },
//       {
//         iconName: 'earn_money',
//         name: {
//           i18nKey: 'leftnav_invite_earn',
//           i18nOption: { value: formatMoney(10000) },
//         },
//         color: 'var(--base-1-main)',
//         isBorder: true,
//         isShowRedDot: false,
//         isShowArrow: true,
//         action: () => {
//           setInviteCurTab(InvitePageTabType.EARN);
//           handleMyPageClick({
//             actionName: handleMyPageEarnMoneyLineBtnClick,
//           });
//         },
//       },
//       {
//         iconName: 'deposit',
//         name: {
//           i18nKey: 'leftnav_recharge_bonus',
//           i18nOption: { value: '5' },
//         },
//         color: 'var(--base-1-main)',
//         isBorder: true,
//         isShowRedDot: false,
//         isShowArrow: true,
//         action: () => {
//           handleMyPageClick({
//             actionName: handleMyPageDepositBtnClick,
//           });
//         },
//       },
//       {
//         iconName: 'vip',
//         name: {
//           i18nKey: 'leftnav_bonus_monthly',
//           i18nOption: { value: formatMoney(99999) },
//         },
//         color: 'var(--base-1-main)',
//         isBorder: true,
//         isShowRedDot: false,
//         isShowArrow: true,
//         action: () => {
//           handleMyPageClick({
//             actionName: handleMyPageVIPDetailBtnClick,
//           });
//         },
//       },
//       {
//         iconName: 'activity',
//         name: { i18nKey: 'account_menu_piggy_bank' },
//         color: 'var(--base-1-main)',
//         isBorder: true,
//         isShowRedDot: false,
//         isShowArrow: true,
//         action: () => {
//           handleMyPageClick({
//             actionName: handleMyPageActivityLineBtnClick,
//           });
//         },
//       },
//       {
//         iconName: 'user',
//         name: { i18nKey: 'account_menu_personal_information' },
//         color: 'var(--grayscale-100)',
//         isBorder: true,
//         isShowRedDot: false,
//         isShowArrow: true,
//         action: () => {
//           handleMyPageClick({
//             actionName: handleMyPagePersonalInformationLineBtnClick,
//           });
//         },
//       },
//       {
//         iconName: 'change_password',
//         name: { i18nKey: 'account_menu_change_password' },
//         color: 'var(--grayscale-100)',
//         isBorder: true,
//         isShowRedDot: false,
//         isShowArrow: true,
//         action: () => {
//           handleMyPageClick({
//             actionName: handleMyPageChangePasswordLineBtnClick,
//           });
//         },
//       },
//       {
//         iconName: 'bank_account',
//         name: { i18nKey: 'account_menu_bank_account' },
//         color: 'var(--grayscale-100)',
//         isBorder: true,
//         isShowRedDot: false,
//         isShowArrow: true,
//         action: () => {
//           handleMyPageClick({
//             actionName: handleMyPageBankAccountLineBtnClick,
//           });
//         },
//       },
//       {
//         iconName: 'reload',
//         name: { i18nKey: 'account_menu_refresh_version' },
//         color: 'var(--grayscale-100)',
//         isBorder: true,
//         isShowRedDot: realTimeH5Version.isNewVersion,
//         isShowArrow: false,
//         action: () => {
//           handleMyPageClick({
//             actionName: handleMyPageReloadVersionLineBtnClick,
//           });
//         },
//       },
//     ];
//   }, [realTimeH5Version]);
//
//   return (
//     <div className="btnItems">
//       {lineBtnList.map((item) => {
//         return (
//           <button
//             key={`LineBtn - ${renderI18N(item.name, t)} - ${item.iconName}`}
//             className={cx(
//               'item',
//               {
//                 'item-border': item.isBorder,
//               },
//               'last:!border-b-0'
//             )}
//             onClick={() => {
//               // if (`${item.actionName}` in lineBtnActionObj)
//               //   lineBtnActionObj[item.actionName]();
//               item.action && item.action();
//             }}
//           >
//             <Icon
//               className="w-6 h-6"
//               name={`ic_${item.iconName}`}
//               color={item && item.color ? item.color : 'var(--base-2-main)'}
//             />
//
//             <div className="item-txt flex justify-between items-center gap-1">
//               {renderI18N(item.name, t)}
//               {item.isShowRedDot ? (
//                 <RedDot size="8" className={'animate-none'} />
//               ) : null}
//             </div>
//
//             {item.isShowArrow ? (
//               <Icon
//                 className="w-4 h-4"
//                 name={`ic_arrow_right_1`}
//                 color="var(--grayscale-100)"
//               />
//             ) : null}
//           </button>
//         );
//       })}
//     </div>
//   );
// });
//
// export default MyPageLineBtns;
