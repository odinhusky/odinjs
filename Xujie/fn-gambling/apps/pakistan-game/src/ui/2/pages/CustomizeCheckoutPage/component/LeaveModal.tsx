import BasePrimaryOutlineBtn from '@components/BasePrimaryOutlineBtn';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { cx } from '@libs/commonUtils';
import BaseModal from '@libs/components/Modal';
import { useTranslation } from 'react-i18next';

const LeaveModal = ({
  onLeave,
  onClose,
}: {
  onLeave?: () => void;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <BaseModal className="">
      <div className="max-w-80 bgi-[var(--grayscale-100)] rounded-lg p-4 bgi-text-[var(--grayscale-30)] font-medium text-sm">
        <div>
          <span className="bgi-text-[var(--state-error-main)]">
            Entering your UTR is required,{' '}
          </span>
          <span>and not doing so may lead to failed payments.</span>
        </div>
        <div className="mt-2">
          Are you sure you want to leave without submitting UTR?
        </div>
        <div className="flex justify-between gap-2 mt-6">
          <BasePrimaryOutlineBtn
            className={cx('flex-1 h-8', 'text-sm mobile:text-sm')}
            onClick={onLeave}
            children={t('wallet_popup_leave')}
          />

          <BasePrimaryBtn
            className={cx('flex-1', 'w-auto h-8', 'text-sm mobile:text-sm')}
            onClick={onClose}
            children={t('game_popup_leave_btn_continue')}
          />
        </div>
      </div>
    </BaseModal>
  );
};
export default LeaveModal;
