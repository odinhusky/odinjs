import NoData from '@components/NoData';
import { ITableColumn, ModeTable } from '@components/Table';
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
import QuestionTooltip from '@components/QuestionTooltip';
import * as React from 'react';
import TableSkeleton from '@components/TableSkeleton';

const recordStateI18nKeyMapping: Record<string, string> = {
  COMPLETED: 'spin_and_share_wheel_withdrawal_history_state_completed',
  PROCESSING: 'spin_and_share_wheel_withdrawal_history_state_processing',
  FAILED: 'spin_and_share_wheel_withdrawal_history_state_failure',
  CANCELED: 'spin_and_share_wheel_withdrawal_history_state_failure',
  UNKNOWN: 'spin_and_share_wheel_withdrawal_history_state_failure',
};

const getStatusI18nKey = (state: string) => {
  return (
    recordStateI18nKeyMapping[state] ||
    'spin_and_share_wheel_withdrawal_history_state_failure'
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
  const isTableLoading = useActivityRecordPageStore(
    (state) => state.isTableLoading
  );
  const columns: ITableColumn<InviteWithdrawItemResult>[] = [
    {
      title: 'spin_and_share_wheel_withdrawal_history_table_title_time',
      dataIndex: 'time',
      render: (v) => {
        return formatDate(v.time, 'YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title:
        'spin_and_share_wheel_withdrawal_history_table_title_withdraw_amount',
      dataIndex: 'amount',
      render: (v) => {
        return formatMoney({ value: v.amount });
      },
    },
    {
      title: 'spin_and_share_wheel_withdrawal_history_table_title_state',
      dataIndex: 'state',
      render: (v) => {
        const txtColorClassName = getStatusColor(v.state);
        return (
          <div className="flex items-center gap-2">
            <span className={cx(txtColorClassName)}>
              {renderI18N({ i18nKey: getStatusI18nKey(v.state) }, t)}
            </span>
            {v.state === InviteWithdrawState.FAILED ? (
              <QuestionTooltip
                btnClassName={'p-0'}
                placement={'topRight'}
                offset={[12, -8]}
                iconClassName={'w-4.5 h-4.5'}
                iconName={'ic_information_1'}
                title={t(
                  `spin_and_share_wheel_withdrawal_history_state_failure_${v.errorCode}`
                )}
              />
            ) : null}
          </div>
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
        '!-mx-4 m-auto px-4'
        // {
        //   'mt-20': inviteWithdrawalHistoryList.length === 0,
        // }
      )}
    >
      <ModeTable
        isShowThead={true}
        isLoading={isTableLoading}
        skeleton={
          <TableSkeleton
            length={columns.length}
            key={inviteWithdrawalHistoryList?.length || 0 + columns.length}
          />
        }
        rowKey={'time'}
        classNames={{
          table: '!rounded-none',
          thead:
            '!h-10 !max-h-10 !min-h-10 !bg-transparent !border-[var(--transparent-white-10)]',
          theadTr:
            '!p-0 !py-1 text-xs font-medium !bgi-text-[var(--base-2-variant2)]',
          tbodyTr:
            '!h-[53px] !text-sm !font-medium border-b border-[var(--transparent-white-10)]',
          tbodyTd: '!whitespace-pre-wrap !bgi-text-[var(--base-2-variant2)]',
        }}
        dataSource={inviteWithdrawalHistoryList}
        columns={columns}
        noData={
          <NoData
            styles={{
              container: 'mt-64',
            }}
          />
        }
      />
    </div>
  );
};
export default InviteWheelWithdrawalRecordContent;
