import { useTranslation } from 'react-i18next';
import { formatDate, formatNumber } from '@mode2/utils';
import { handleRecordPageCopyOrderNumberClick } from '@mode2/action/recordPageAction/acitonType';
import { useRecordPageActions } from '@mode2/action/recordPageAction/useRecordPageActions';
import { cx } from '@libs/commonUtils/cx';
import { useRecordPageBalanceRecordStore } from '@mode2/zustand/page/recordPageStore';
import {
  WithdrawRecordItemResult,
  WithdrawRecordStatus,
} from '@mode2API/endpoint/record/PostWithdrawRecordsEndpoint';
import NoData from '@components/NoData';
import Icon from '@libs/mode2/components/Icon';

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

const RecordWithdrawalItemHeader = (item: WithdrawRecordItemResult) => {
  const { t } = useTranslation();
  const statusColorClass: string = getStatusColor(item.status);
  return (
    <div className="bgi-[var(--grayscale-15)] grid grid-cols-3 p-1 gap-1 mobile:p-3 mobile:gap-3">
      <div
        className={cx('flex items-center justify-center gap-1', 'text-center')}
      >
        {formatDate(item.timestamp)}
      </div>
      <div className={'flex items-center justify-center gap-1'}>
        <Icon className="h-4 w-4 mobile:h-6 mobile:w-6" name="ic_rs" />
        <span className={statusColorClass}>
          {formatNumber(item.amount, true)}
        </span>
      </div>
      <div
        className={cx(
          'flex items-center justify-center gap-1',
          statusColorClass
        )}
      >
        {t(getStatusI18nKey(item.status))}
      </div>
    </div>
  );
};

const RecordWithdrawalItemBody = (item: WithdrawRecordItemResult) => {
  const { t } = useTranslation();
  const { handleRecordPageClick } = useRecordPageActions();
  return (
    <div className="flex bgi-[var(--grayscale-25)] justify-between py-1 px-2 items-center mobile:py-3 mobile:px-6 mobile:gap-3">
      <div className="flex w-full items-center gap-2">
        <Icon
          className="h-6 w-6 mobile:h-9 mobile:w-9"
          name="ic_deposit"
          color="var(--grayscale-70)"
        />
        <div className="flex flex-wrap mobile:flex-nowrap text-xs font-normal mobile:font-medium mobile:text-base">
          <span>
            {t(
              'account_balance_record_add_cash_record_table_content_order_number'
            )}
          </span>
          <span>{item.orderNumber}</span>
        </div>
      </div>

      <button
        className="flex gap-1 justify-center items-center font-medium text-2xl mobile:flex-row mobile:text-xs flex-col mobile:flex-row"
        onClick={() => {
          handleRecordPageClick({
            actionName: handleRecordPageCopyOrderNumberClick,
            payload: {
              text: item.orderNumber,
            },
          });
        }}
      >
        <Icon className="h-5 w-5 mobile:h-6 mobile:w-6" name="ic_copy" />
        <span className="text-xs font-medium mobile:text-sm">
          {t('account_balance_record_add_cash_record_btn_copy')}
        </span>
      </button>
    </div>
  );
};

const RecordPageRecordWithdrawalTable = () => {
  const withdrawRecordList = useRecordPageBalanceRecordStore(
    (state) => state.withdrawRecordList
  );
  return (
    <div className="overflow-y-auto max-h-[576px] mt-2 mobile:mt-3 tablet:mt-4 ">
      <div className="flex flex-col gap-2 bgi-text-[var(--grayscale-70)] text-xs font-normal mobile:gap-3 mobile:text-base mobile:font-medium tablet:gap-4">
        {withdrawRecordList.map((data, index) => {
          return (
            <div
              key={index}
              className="flex flex-col rounded overflow-hidden shadow-[4px_4px_8px_#00000040]"
            >
              <RecordWithdrawalItemHeader {...data} />

              <RecordWithdrawalItemBody {...data} />
            </div>
          );
        })}
        {!withdrawRecordList || withdrawRecordList.length === 0 ? (
          <NoData />
        ) : null}
      </div>
    </div>
  );
};

export default RecordPageRecordWithdrawalTable;
