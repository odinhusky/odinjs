import { useTranslation } from 'react-i18next';
import cx from '@commonUtils/cx';

// 先抽成變數未來要調整時就不用改字串
const BANK_COMMISSION_PERCENTAGE = 3; // 3% 手續費
const BANK_COMMISSION_FLAT_FEE = 6; // 固定手續費 6 INR

export const WithdrawNoteDescription = () => {
  const { t } = useTranslation();

  // const [noteDesc1, noteDesc2] = t('wallet_withdraw_note_content', {
  //   percentage: BANK_COMMISSION_PERCENTAGE,
  //   flatFee: BANK_COMMISSION_FLAT_FEE,
  // }).split('\n');

  return (
    <div className={cx('gap-2 mt-5', 'bgi-text-[var(--state-warn-main)]')}>
      <div className="flex gap-2 items-center">
        <span className="bgi-text-[var(--state-error-main)] text-sm font-semibold">
          *
        </span>
        <span className="text-sm font-semibold">
          {t('wallet_withdraw_note_title')}
        </span>
      </div>
      <div className={cx('text-sm font-medium mt-1')}>
        <ul className="withdraw-note-list list-disc ml-5 bgi-text-[var(--state-warn-main)]">
          <li className="bgi-text-[var(--state-warn-main)]">
            {t('wallet_withdraw_note_1', {
              percentage: BANK_COMMISSION_PERCENTAGE,
              flatFee: BANK_COMMISSION_FLAT_FEE,
            })}
          </li>
          <li>{t('wallet_withdraw_note_2')}</li>
        </ul>
      </div>
    </div>
  );
};
