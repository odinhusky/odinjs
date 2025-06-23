import NoData from '@components/NoData';
import Table, { ITableColumn } from '@components/Table';
import cx from '@libs/commonUtils/cx';
import renderI18N from '@libs/commonUtils/renderI18N';
import { InviteWithdrawItemResult } from '@libs/mode2/external/api/endpoint/wheel/PostInviteWheelWithdrawListEndpoint';
import { formatDate, formatMoney } from '@libs/mode2/utils';
import { useActivityRecordPageStore } from '@libs/mode2/zustand/page/activityRecordPageStore';
import { useTranslation } from 'react-i18next';
import useInviteWheelWithdrawalRecordBase from '@mode2/usecase/page/activityRecordPage/useInviteWheelWithdrawalRecordBase';

const recordStateI18nKeyMapping: Record<string, string> = {
  COMPLETED: 'spin_and_share_wheel_withdrawal_history_state_completed',
  PROCESSING: 'account_balance_record_add_cash_record_table_content_processing',
  FAILED: 'failed',
  CANCELED: 'canceled',
  UNKNOWN: 'unknown',
};

const getStatusI18nKey = (state: string) => {
  return (
    recordStateI18nKeyMapping[state] ||
    'account_balance_record_add_cash_record_table_content_fail'
  );
};

const getStatusColor = (state: string) => {
  // 状态颜色
  if (state === 'COMPLETED') {
    return 'bgi-text-[var(--state-success-main)]';
  } else {
    return 'bgi-text-[var(--state-error-main)]';
  }
};

const InviteWheelWithdrawalRecordContent = () => {
  useInviteWheelWithdrawalRecordBase();
  const { t } = useTranslation();
  const inviteWithdrawalHistoryList = useActivityRecordPageStore(
    (state) => state.inviteWithdrawalHistoryList
  );
  const columns: ITableColumn<InviteWithdrawItemResult>[] = [
    {
      title: 'spin_and_share_wheel_withdrawal_history_table_title_time',
      dataIndex: 'time',
      render: (v) => {
        return formatDate(v.time);
      },
    },
    {
      title:
        'spin_and_share_wheel_withdrawal_history_table_title_withdraw_amount',
      dataIndex: 'amount',
      render: (v) => {
        return formatMoney({ value: v.amount, includeDecimal: true });
      },
    },
    {
      title: 'spin_and_share_wheel_withdrawal_history_table_title_state',
      dataIndex: 'state',
      render: (v) => {
        const txtColorClassName = getStatusColor(v.state);
        return (
          <span className={cx(txtColorClassName)}>
            {renderI18N({ i18nKey: getStatusI18nKey(v.state) }, t)}
          </span>
        );
      },
    },
  ];

  return (
    <div
      className={cx('bgi-text-[var(--grayscale-100)] mt-3 mb-5', {
        'mt-20': inviteWithdrawalHistoryList.length === 0,
      })}
    >
      <Table
        rowKey={'time'}
        classNames={{
          table: 'mobile:max-h-[80vh] max-h-[75vh]',
          tbody: 'overscroll-contain',
          tbodyTr: '!h-auto !p-1 !bgi-[var(--grayscale-20)]',
          tbodyTd: '!whitespace-pre-wrap',
        }}
        dataSource={inviteWithdrawalHistoryList}
        columns={columns}
        noData={
          <NoData text={t('spin_and_share_wheel_withdrawal_history_no_data')} />
        }
      />
    </div>
  );
};
export default InviteWheelWithdrawalRecordContent;
