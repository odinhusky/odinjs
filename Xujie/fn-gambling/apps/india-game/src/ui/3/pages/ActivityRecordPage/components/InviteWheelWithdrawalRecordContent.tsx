import NoData from '@components/NoData';
import Table, { ITableColumn } from '@components/Table';
import cx from '@libs/commonUtils/cx';
import renderI18N from '@libs/commonUtils/renderI18N';
import {
  InviteWithdrawItemResult,
  InviteWithdrawState,
} from '@libs/mode2/external/api/endpoint/wheel/PostInviteWheelWithdrawListEndpoint';
import { formatDate, formatMoney } from '@libs/mode2/utils';
import { useActivityRecordPageStore } from '@libs/mode2/zustand/page/activityRecordPageStore';
import { useTranslation } from 'react-i18next';
import useInviteWheelWithdrawalRecordBase from '@mode2/usecase/page/activityRecordPage/useInviteWheelWithdrawalRecordBase';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';

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

const getStatusColor = (state: InviteWithdrawState) => {
  // 状态颜色
  switch (state) {
    case InviteWithdrawState.COMPLETED:
      return 'bgi-text-[var(--state-success-main)]';
    case InviteWithdrawState.PROCESSING:
      return 'bgi-text-[var(--base-1-90)]';
    case InviteWithdrawState.FAILED:
      return 'bgi-text-[var(--state-error-main)]';
    case InviteWithdrawState.CANCELED:
      return 'bgi-text-[var(--state-error-main)]';
    case InviteWithdrawState.UNKNOWN:
      return 'bgi-text-[var(--state-error-main)]';
    default:
      return 'bgi-text-[var(--state-success-main)]';
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
        return formatMoney(v.amount, true);
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
      className={cx(
        'bgi-text-[var(--base-2-variant2)]',
        'text-sm',
        // 'mt-3 mb-5',
        'w-screen',
        MOBILE_BREAK_POINT_MAX_WIDTH,
        '!-mx-4 m-auto px-4',
        {
          'mt-20': inviteWithdrawalHistoryList.length === 0,
        }
      )}
    >
      <Table
        rowKey={'time'}
        classNames={{
          thead: cx(
            '!bg-transparent !bgi-text-[var(--base-2-variant2)] !text-sm !h-auto !min-h-auto',
            '!h-10 !max-h-10 !min-h-10',
            '!bgi-border-b-[var(--transparent-white-10)]'
          ),
          theadTr: '!p-0 !min-h-10',
          theadTth: '!p-0 !bg-transparent',
          table: 'max-h-[75vh]',
          tbody: 'overscroll-contain',
          tbodyTr:
            '!h-auto !py-4 !text-sm !font-medium !bgi-border-b-[var(--transparent-white-10)] border-b',
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
