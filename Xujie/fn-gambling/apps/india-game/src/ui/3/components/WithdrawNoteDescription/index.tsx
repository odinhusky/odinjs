import { useTranslation } from 'react-i18next';
import { formatNumber } from '@mode2/utils';
import { Trans } from 'react-i18next';

export const WithdrawNoteDescription = () => {
  const { t } = useTranslation();

  return (
    <div className="bgi-text-[var(--base-2-variant2)] text-base font-medium pr-4">
      <div>{'Remaining Withdrawal Limit:'}</div>
      {/*<Trans*/}
      {/*  i18nKey={'wallet_my_balance'}*/}
      {/*  values={{ balance: formatNumber(232, true) }}*/}
      {/*  components={{*/}
      {/*    balanceTab: (*/}
      {/*      <span className="text-xs bgi-text-[var(--base-1-main)]" />*/}
      {/*    ),*/}
      {/*  }}*/}
      {/*/>*/}

      <p className="text-xs">
        {
          '3%+₹6 of the withdrawal amount will be deducted as bank commission. Under normal circumstances, the withdrawal amount will arrive in your account in about 24 hours.'
        }
      </p>

      <p className="text-xs">
        {
          'Under normal circumstances, the withdrawal amount will arrive in your account in about 24 hours.'
        }
      </p>
    </div>
  );
};

export default WithdrawNoteDescription;
