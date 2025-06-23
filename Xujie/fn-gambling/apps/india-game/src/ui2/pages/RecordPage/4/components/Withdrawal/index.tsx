import Icon from '@components/Icon';
import NoData from '@components/NoData';
import { cx } from '@libs/commonUtils';
import { WithdrawRecordStatus } from '@libs/mode2/external/api/endpoint/record/PostWithdrawRecordsEndpoint';
import { formatDate } from '@libs/mode2/utils';
import { useRecordPageBalanceRecordStore } from '@libs/mode2/zustand/page/recordPageStore';
import QuestionTooltip from '@components/QuestionTooltip';
import { useTranslation } from 'react-i18next';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@libs/constant/style';

const recordStateI18nKeyMapping: Record<WithdrawRecordStatus, string> = {
  [WithdrawRecordStatus.PROCESSING]:
    'account_balance_record_add_cash_record_table_content_processing',
  [WithdrawRecordStatus.SUCCESS]:
    'account_balance_record_add_cash_record_table_content_success',
  [WithdrawRecordStatus.FAIL]: 'wallet_detail_withdrawal_state_rejected',
  [WithdrawRecordStatus.FAIL_EXPIRED]:
    'wallet_detail_withdrawal_state_rejected',
};

const getStatusI18nKey = (state: WithdrawRecordStatus) => {
  return recordStateI18nKeyMapping[state] || WithdrawRecordStatus.FAIL;
};

const getStatusColor = (state: WithdrawRecordStatus) => {
  if (state === WithdrawRecordStatus.PROCESSING) {
    return 'bgi-text-[var(--state-warning-main)]';
  } else if (state === WithdrawRecordStatus.SUCCESS) {
    return 'bgi-text-[var(--state-success-main)]';
  } else {
    return 'bgi-text-[var(--state-error-main)]';
  }
};

const Withdrawal = () => {
  const { t } = useTranslation();
  const withdrawRecordList = useRecordPageBalanceRecordStore(
    (state) => state.withdrawRecordList
  );

  const tableTitle = ['Time & Order Number', 'Request Amount', 'State'];
  console.log(withdrawRecordList, 'withdrawRecordList');

  return (
    <div className="text-xs">
      <div
        className={cx(
          MOBILE_BREAK_POINT_MAX_WIDTH,
          'w-full -ml-4 ',
          'fixed top-20 z-10',
          'last:text-right bgi-[var(--base-2-variant11)]'
        )}
      >
        <div
          className={cx(
            'p-3 mx-4 box-border flex justify-between border-b border-[var(--transparent-white-10)]'
          )}
        >
          {tableTitle.map((item, index) => {
            return (
              <div className="bgi-text-[var(--base-2-variant2)]" key={index}>
                {item}
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-10">
        {withdrawRecordList.map((data, index) => {
          return (
            <div
              key={index}
              className={cx(
                'py-[18px] px-3 box-border',
                'flex justify-between',
                'border-b border-[var(--transparent-white-10)]'
              )}
            >
              <div className="w-1/2 bgi-text-[var(--base-2-variant2)]">
                <div className="mb-1">
                  {formatDate(data.timestamp, 'YYYY-MM-DD HH:mm:ss')}
                </div>
                <div>NO: {data.orderNumber}</div>
              </div>
              <div className="flex items-center gap-1 w-1/5">
                <Icon name="ic_coin" className="w-5 h-5" />
                <span className="text-sm font-medium bgi-text-[var(--state-success-main)]">
                  {data.amount}
                </span>
              </div>
              <div className="w-1/4 flex items-end flex-col justify-center">
                <div className="flex items-center justify-end gap-1.5 mb-1.5">
                  <span className={cx(getStatusColor(data.status))}>
                    {t(getStatusI18nKey(data.status))}
                  </span>
                  {data.message ? (
                    <QuestionTooltip
                      placement="topRight"
                      offset={[8.5, -7]}
                      title={t('login_referral_code_reward_tips')}
                      iconClassName="w-4 h-4"
                      overlayClassName=""
                      btnClassName="!p-0"
                      color="var(--base-2-vriant11"
                      iconName="ic_tips_outline_2"
                    />
                  ) : null}
                </div>

                {data.status === WithdrawRecordStatus.FAIL ? (
                  <div className="text-right bgi-text-[var(--base-2-variant2)]">
                    {t('wallet_detail_withdrawal_state_rejected_note')}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
        {!withdrawRecordList || withdrawRecordList.length === 0 ? (
          <div className="mt-72">
            <NoData />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Withdrawal;
