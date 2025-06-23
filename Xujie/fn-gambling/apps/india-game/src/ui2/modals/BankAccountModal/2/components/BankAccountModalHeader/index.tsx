import cx from '@commonUtils/cx';
import {
  FLEX_CENTER,
  FLEX_ITEMS_CENTER,
  MOBILE_BREAK_POINT_MAX_WIDTH,
} from '@constant/style';
import { Icon } from '@components/Icon';
import { useTranslation } from 'react-i18next';
import { useWalletPageStore } from '@mode2/zustand/page/WalletPage/walletPageStore';

/**
 * Evan for [V6] Done
 */
export const BankAccountModalHeader = () => {
  const { t } = useTranslation();
  const setShowBankAccountModal = useWalletPageStore(
    (state) => state.setShowBankAccountModal
  );
  return (
    <div
      className={cx(
        FLEX_ITEMS_CENTER,
        MOBILE_BREAK_POINT_MAX_WIDTH,
        'justify-between',
        'w-full min-h-20',
        'bgi-[var(--base-2-variant5)]',
        'px-4'
      )}
    >
      <Icon
        className={cx('w-7 h-7 cursor-pointer')}
        name={'ic_back_header'}
        onClick={() => {
          setShowBankAccountModal(false);
        }}
      />

      <div
        className={cx(
          FLEX_CENTER,
          'w-full',
          'bgi-text-[var(--grayscale-100)]',
          'text-2xl font-medium'
        )}
      >
        {t('withdrawal_bank_account_page_title')}
      </div>
    </div>
  );
};

export default BankAccountModalHeader;
