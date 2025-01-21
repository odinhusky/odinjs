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
        'bgi-[var(--grayscale-15)] border-solid',
        'bgi-text-[var(--grayscale-70)] text-center font-medium text-xs mobile:text-base',
        'mobile:rounded-lg rounded',
        'grid gap-1 mobile:grid-cols-3 mobile:gap-3',
        'mobile:py-2 mobile:px-3 p-1',
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
