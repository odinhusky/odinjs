import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { cx } from '@libs/commonUtils';
import renderI18N from '@libs/commonUtils/renderI18N';
import BaseModal from '@libs/components/Modal';
import { useGiftCodeRedeemStore } from '@libs/mode2/zustand/page/GiftCodeRedeemPage/useGiftCodeRedeemStore';
import { useTranslation } from 'react-i18next';

const MaxLimitModal = () => {
  const { t } = useTranslation();

  const showMaxLimitModal = useGiftCodeRedeemStore(
    (state) => state.showMaxLimitModal
  );
  const setShowMaxLimitModal = useGiftCodeRedeemStore(
    (state) => state.setShowMaxLimitModal
  );

  return showMaxLimitModal ? (
    <BaseModal>
      <div
        className={cx(
          'w-[256px] p-4 box-border',
          'rounded-lg',
          'text-center bgi-text-[var(--grayscale-50)] bgi-[var(--grayscale-100)]'
        )}
      >
        <div className="text-sm font-medium">
          {renderI18N({ i18nKey: 'gift_code_redemption_code_finish_toast' }, t)}
        </div>
        <BasePrimaryBtn
          className="h-8 mt-3 text-base"
          children={'Confirm'}
          onClick={() => setShowMaxLimitModal(false)}
        />
      </div>
    </BaseModal>
  ) : null;
};

export default MaxLimitModal;
