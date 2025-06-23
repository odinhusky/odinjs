import { WalletPageTabType } from '@libs/mode2/@types/walletPageTabType';
import { RechargeRecordStatus } from '@libs/mode2/external/api/endpoint/record/PostRechargeRecordsEndpoint';
import { WithdrawRecordStatus } from '@libs/mode2/external/api/endpoint/record/PostWithdrawRecordsEndpoint';

const recordRechargeStateI18nKeyMapping: Record<RechargeRecordStatus, string> =
  {
    [RechargeRecordStatus.PROCESSING]: 'deposit_history_deposit_status_pending',
    [RechargeRecordStatus.SUCCESS]: 'withdrawal_history_status_success',
    [RechargeRecordStatus.FAIL]: 'deposit_history_deposit_status_failed',
  };

const recordWithdrawStateI18nKeyMapping: Record<WithdrawRecordStatus, string> =
  {
    [WithdrawRecordStatus.PROCESSING]: 'withdrawal_history_status_reviewing',
    [WithdrawRecordStatus.SUCCESS]: 'withdrawal_history_status_success',
    [WithdrawRecordStatus.FAIL]: 'withdrawal_order_detail_rejected',
    [WithdrawRecordStatus.FAIL_EXPIRED]: 'withdrawal_order_detail_rejected',
  };

export const getStatusI18nKey = (
  state: RechargeRecordStatus | WithdrawRecordStatus,
  type: WalletPageTabType
) => {
  console.log('@@===> getStatusI18nKey', state, type);

  if (type === WalletPageTabType.DEPOSIT) {
    const rechargeState = state as RechargeRecordStatus;
    return recordRechargeStateI18nKeyMapping[
      rechargeState || RechargeRecordStatus.FAIL
    ];
  }

  const withdrawState = state as WithdrawRecordStatus;
  return recordWithdrawStateI18nKeyMapping[
    withdrawState || WithdrawRecordStatus.FAIL
  ];
};
