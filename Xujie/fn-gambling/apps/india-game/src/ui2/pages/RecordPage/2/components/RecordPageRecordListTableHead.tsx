import { cx } from '@libs/commonUtils/cx';
import {
  RecordPageBalanceRecordTabs,
  useRecordPageBalanceRecordStore,
} from '@mode2/zustand/page/recordPageStore';
import { useTranslation } from 'react-i18next';

export const RecordPageRecordListTableHead = () => {
  const { t } = useTranslation();
  const activeListSwitchTabIndex = useRecordPageBalanceRecordStore(
    (state) => state.activeListSwitchTabIndex
  );

  const theads = [
    [
      t('account_balance_record_fund_transfer_records_table_header_date'),
      t('account_balance_record_fund_transfer_records_table_header_operate'),
      t(
        'account_balance_record_fund_transfer_records_table_header_asset_changes'
      ),
    ],
    [
      t('account_balance_record_fund_transfer_records_table_header_date'),
      t('account_balance_record_add_cash_record_table_header_quantity'),
      t('account_balance_record_add_cash_record_table_header_state'),
    ],
    [
      t('account_balance_record_fund_transfer_records_table_header_date'),
      t('account_balance_record_add_cash_record_table_header_quantity'),
      t('account_balance_record_add_cash_record_table_header_state'),
    ],
  ];

  return (
    <div
      className={cx(
        'bgi-[var(--grayscale-15)] p-1 mobile:p-3 border-solid border-b-[1px] border-b-[var(--grayscale-15)] ',
        'bgi-text-[var(--grayscale-50)] text-center font-medium text-xs mobile:text-base',
        'rounded-t mobile:rounded-t-lg rounded-b-none',
        'grid gap-1 mobile:grid-cols-3 mobile:gap-3',
        {
          'grid-cols-[1fr_1fr_2fr]':
            activeListSwitchTabIndex ===
            RecordPageBalanceRecordTabs.FUND_TRANSFER_RECORD,
          'grid-cols-3':
            activeListSwitchTabIndex !==
            RecordPageBalanceRecordTabs.FUND_TRANSFER_RECORD,
        }
      )}
    >
      {theads[activeListSwitchTabIndex].map((data, index) => {
        return (
          <div key={index} className="w-full">
            {data}
          </div>
        );
      })}
    </div>
  );
};

export default RecordPageRecordListTableHead;
