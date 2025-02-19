import Icon from '@components/Icon';
import NoData from '@components/NoData';
import { cx } from '@libs/commonUtils';
import { WithdrawRecordStatus } from '@libs/mode2/external/api/endpoint/record/PostWithdrawRecordsEndpoint';
import { formatDate } from '@libs/mode2/utils';
import { useRecordPageBalanceRecordStore } from '@libs/mode2/zustand/page/recordPageStore';
import QuestionTooltip from '@components/QuestionTooltip';
import { useTranslation } from 'react-i18next';

const recordStateI18nKeyMapping: Record<WithdrawRecordStatus, string> = {
  [WithdrawRecordStatus.PROCESSING]:
    'account_balance_record_add_cash_record_table_content_processing',
  [WithdrawRecordStatus.SUCCESS]:
    'account_balance_record_add_cash_record_table_content_success',
  [WithdrawRecordStatus.FAIL]:
    'account_balance_record_add_cash_record_table_content_fail',
  [WithdrawRecordStatus.FAIL_EXPIRED]:
    'account_balance_record_add_cash_record_table_content_fail_expired',
};

const getStatusI18nKey = (state: WithdrawRecordStatus) => {
  return recordStateI18nKeyMapping[state] || WithdrawRecordStatus.FAIL;
};

const getStatusColor = (state: WithdrawRecordStatus) => {
  if (state === WithdrawRecordStatus.PROCESSING) {
    return 'bgi-text-[var(--state-warn-main)]';
  } else if (state === WithdrawRecordStatus.SUCCESS) {
    return 'bgi-text-[var(--state-success-main)]';
  } else {
    return 'bgi-text-[var(--state-error-main)]';
  }
};

// TODO Ronan
// TODO i18n
// TODO 狀態文案待確認
const Withdrawal = () => {
  const { t } = useTranslation();
  const withdrawRecordList = useRecordPageBalanceRecordStore(
    (state) => state.withdrawRecordList
  );

  const tableTitle = ['Time & Order Number', 'Request Amount', 'State'];
  console.log(withdrawRecordList, 'withdrawRecordList');

  return (
    <div className="text-xs bgi-text-[var(--base-2-variant2)]">
      <div
        className={cx(
          'w-full mt-3 pb-3 box-border flex justify-around border-b border-[var(--transparent-white-10)]',
          'fixed top-0 left-0 pt-20',
          'bgi-[var(--base-2-vriant11)]'
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
      <div className="mt-10">
        {withdrawRecordList.map((data, index) => {
          return (
            <div
              key={index}
              className={cx(
                'py-[18px] box-border',
                'flex justify-between',
                'border-b border-[var(--transparent-white-10)]'
              )}
            >
              <div className="w-1/2">
                <div className="mb-1">
                  {formatDate(data.timestamp, 'YYYY-MM-DD hh:mm:ss')}
                </div>
                <div>NO: {data.orderNumber}</div>
              </div>
              <div className="flex items-center gap-1 w-1/5">
                <Icon name="ic_coin" className="w-5 h-5" />
                <span className="text-sm font-medium bgi-text-[var(--state-success-main)]">
                  {data.amount}
                </span>
              </div>
              <div className="w-1/5">
                <div className="flex items-center justify-end gap-1.5 mb-1.5">
                  <span className={cx(getStatusColor(data.status))}>
                    {t(getStatusI18nKey(data.status))}
                  </span>
                  {data.message ? (
                    <QuestionTooltip
                      title={data.message}
                      overlayClassName=""
                      btnClassName=""
                      color="var(--grayscale-100)"
                      iconName="ic_tips_outline_2"
                    />
                  ) : null}
                </div>
                {/* TODO Ronan 依據是？ */}
                {data.status === WithdrawRecordStatus.FAIL ? (
                  <div className="text-right">Refund to wallet</div>
                ) : null}
              </div>
            </div>
          );
        })}
        {!withdrawRecordList || withdrawRecordList.length === 0 ? (
          <div className="h-[50vh] flex justify-center items-center">
            <NoData />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Withdrawal;
