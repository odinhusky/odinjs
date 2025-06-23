import Modal from '@mode2/components/Modal';
import cx from '@commonUtils/cx';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import { Icon } from '@components/Icon';
import { useTranslation } from 'react-i18next';
import { useWalletPageStore } from '@mode2/zustand/page/WalletPage/walletPageStore';
import sdkUtils from '@mode2/utils/sdk';
import BankAccountModalHeader from './components/BankAccountModalHeader';
import BankAccountInfoContent from './components/BankAccountInfoContent';

/**
 * Evan for [V6] Done
 */
export const BankAccountModal = () => {
  const { t } = useTranslation();
  const isShowBankAccountModal = useWalletPageStore(
    (state) => state.isShowBankAccountModal
  );

  return isShowBankAccountModal ? (
    <Modal>
      <div
        className={cx(
          'w-screen h-screen',
          // 'w-full h-full',
          'relative flex flex-col bgi-[var(--background-light)] ',
          MOBILE_BREAK_POINT_MAX_WIDTH,
          'flex-col justify-center items-center'
        )}
      >
        <BankAccountModalHeader />

        <div
          className={cx('w-full h-full', 'flex flex-col gap-4', 'py-4 px-5')}
        >
          <BankAccountInfoContent />

          <div className="bgi-text-[var(--grayscale-100)] text-xl font-medium">
            {t('withdrawal_bank_account_service_question')}
          </div>

          <div
            className={cx(
              'w-full',
              'bgi-[var(--transparent-white-10)]',
              'flex justify-between items-center gap-4 ',
              // 'py-8 px-6',
              'p-3',
              // 'border bgi-border-[var(--transparent-white-20)]',
              'rounded-md'
            )}
          >
            <div className="font-medium">
              <p className="bgi-text-[var(--grayscale-100)] text-base">
                {t('online_customer_service_entry')}
              </p>
              <p className={'bgi-text-[var(--base-2-variant2)] text-xs mt-1'}>
                {t('withdrawal_bank_account_problem_help')}
              </p>
            </div>

            <Icon
              className={'cursor-pointer w-4 h-4'}
              name={'ic_arrow_right_5'}
              onClick={() => {
                sdkUtils.openChat(() => {});
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  ) : null;
};

export default BankAccountModal;
