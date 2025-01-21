import LangueSelect from '@components/LangueSelect';
import { useTranslation } from 'react-i18next';
const ChangeLangueBox = () => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-between items-center bgi-[var(--grayscale-20)] rounded p-2 mobile:px-6 mobile:py-3">
      <span className="bgi-text-[var(--base-2-main)] font-medium">
        {t('wallet_deposit_pay_upi_change_language')}
      </span>
      <LangueSelect className="!w-32" />
    </div>
  );
};

export default ChangeLangueBox;
