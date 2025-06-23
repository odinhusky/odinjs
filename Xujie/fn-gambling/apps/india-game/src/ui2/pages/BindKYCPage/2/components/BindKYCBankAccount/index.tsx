import { FormInput } from '../FormInput';
import FormTitle from '../FormTitle';
import { useKycDisplayStore } from '@/zustand/kyc/useKycDisplayStore';
import { cx } from '@libs/commonUtils';
import { FLEX_COL } from '@libs/constant/style';

interface BindKYCBankAccountProps {
  isShowTitle: boolean;
  validator: {
    username: (value: string) => Promise<void> | undefined;
    bankAccount: (value: string) => Promise<void> | undefined;
    ifscCode: (value: string) => Promise<void> | undefined;
    password: (value: string) => Promise<void> | undefined;
  };
  isShow?: boolean;
}

export const BindKYCBankAccount = ({
  isShowTitle,
  validator,
  isShow = true,
}: BindKYCBankAccountProps) => {
  const isShowPasswordInput = useKycDisplayStore(
    (state) => state.isShowPasswordInput
  );

  return isShow ? (
    <div
      className={cx('relative', {
        'invisible h-[0px] opacity-0 z-[-1]': !isShow,
        '-mb-4 mobile:-mb-5 tablet:-mb-6': isShowPasswordInput === false,
      })}
    >
      {isShowTitle ? (
        <FormTitle title={{ i18nKey: 'account_menu_bank_account' }} />
      ) : null}

      <div className={cx(FLEX_COL, 'gap-4 mobile:gap-5 tablet:gap-6')}>
        {/* Real name */}
        <FormInput
          label={{ i18nKey: 'account_bank_account_input_title_real_name' }}
          name="realName"
          isRequired={true}
          placeholder={{
            i18nKey: 'account_personal_info_input_hint_only_fill_and_english',
          }}
          validator={validator.username}
          tip={{ i18nKey: 'account_bank_account_input_notice_real_name' }}
          type={'en_name'}
        />

        {/* Bank account */}
        <FormInput
          label={{ i18nKey: 'wallet_withdraw_bank_account_bank_account' }}
          name="bankCode"
          isRequired={true}
          maxLength={30}
          placeholder={{
            i18nKey: 'account_bank_account_input_hint_enter_account_number',
          }}
          validator={validator.bankAccount}
        />

        {/* IFSC code */}
        <FormInput
          label={{ i18nKey: 'wallet_withdraw_bank_account_unique_id_codes' }}
          name="ifsc"
          isRequired={true}
          placeholder={{
            i18nKey: 'account_bank_account_input_hint_enter_unique_id_codes',
          }}
          validator={validator.ifscCode}
          maxLength={13}
        />

        {/* Enter the withdrawal password */}
        <FormInput
          label={{
            i18nKey: 'wallet_withdraw_input_hint_withdrawal_password',
          }}
          name="password"
          isRequired={isShowPasswordInput}
          classNameObj={{
            container: cx({
              'h-[0px]': isShowPasswordInput === false,
            }),
          }}
          maxLength={13}
          placeholder={{
            i18nKey: 'wallet_withdraw_input_hint_withdrawal_password',
          }}
          validator={validator.password}
          tip={{
            i18nKey: 'wallet_withdraw_password_reminder',
          }}
          isVisible={isShowPasswordInput}
        />
      </div>
    </div>
  ) : null;
};

export default BindKYCBankAccount;
