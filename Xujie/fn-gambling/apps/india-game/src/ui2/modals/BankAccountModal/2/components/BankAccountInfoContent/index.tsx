import cx from '@commonUtils/cx';
import { Icon } from '@components/Icon';
import { useTranslation } from 'react-i18next';

import renderI18N from '@commonUtils/renderI18N';
import { I18NContent } from '@mode2/@types/i18nType';

import { useMemo } from 'react';
import { useKycDataStore } from '@/zustand/kyc/useKycDataStore';

/**
 * Evan for [V6] Done
 */
const AccountInfoItem = ({
  prefixIcon,
  title,
  content,
}: {
  prefixIcon: string;
  title: I18NContent;
  content: string;
}) => {
  const { t } = useTranslation();
  return (
    <div className="w-full flex justify-start items-start gap-2">
      {prefixIcon ? (
        <Icon className="w-[18px] h-[18px]" name={prefixIcon} />
      ) : null}

      <div className="font-medium">
        <p className="bgi-text-[var(--base-2-variant1)] text-sm">
          {renderI18N(title, t)}
        </p>
        <p className="bgi-text-[var(--grayscale-100)] text-xl mt-1">
          {content}
        </p>
      </div>
    </div>
  );
};
/**
 * Evan for [V6] Done
 */
export const BankAccountInfoContent = () => {
  const bankAccountInfo = useKycDataStore((state) => state.bankAccountInfo);
  const items = useMemo(() => {
    return [
      {
        prefixIcon: 'ic_member_outline',
        title: {
          i18nKey: 'withdrawal_bank_account_account_holder_name_linked',
        },
        content: bankAccountInfo.realName,
      },
      {
        prefixIcon: 'ic_account_number',
        title: { i18nKey: 'withdrawal_bank_account_account_number_linked' },
        content: bankAccountInfo.bankCode,
      },
      {
        prefixIcon: 'ic_ifsc',
        title: { i18nKey: 'withdrawal_bank_account_ifsc_linked' },
        content: bankAccountInfo.ifsc,
      },
    ];
  }, [bankAccountInfo]);

  return (
    <div
      className={cx(
        'w-full',
        'bgi-[var(--transparent-white-10)]',
        'flex flex-col gap-4',
        'py-8 px-6',
        'border bgi-border-[var(--transparent-white-20)] rounded-md'
      )}
    >
      {items.map((item, index) => {
        return <AccountInfoItem key={index} {...item} />;
      })}
    </div>
  );
};

export default BankAccountInfoContent;
