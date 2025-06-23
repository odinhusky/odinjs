import { FormInput } from '../FormInput';
import { cx } from '@libs/commonUtils';
import { FLEX_COL } from '@libs/constant/style';
import { ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS } from '@constant/options';

export interface BindKYCBankAccountValidator {
  username: (value: string) => Promise<void> | undefined;
  bankAccount: (value: string) => Promise<void> | undefined;
  repeatBankAccount: (
    value: string,
    repeat?: string
  ) => Promise<void> | undefined;
  ifscCode: (value: string) => Promise<void> | undefined;
  repeatIfscCode: (value: string) => Promise<void> | undefined;
  password: (value: string) => Promise<void> | undefined;
}

interface BindKYCBankAccountProps {
  isShowTitle: boolean;
  validator: BindKYCBankAccountValidator;
  isShow?: boolean;
}

export const BindKYCBankAccount = ({
  isShowTitle,
  validator,
  isShow = true,
}: BindKYCBankAccountProps) => {
  // const { t } = useTranslation();
  // const isShowPasswordInput = useKycDisplayStore(
  //   (state) => state.isShowPasswordInput
  // );

  return isShow ? (
    <div
      className={cx(
        // 'relative',
        {
          'invisible h-[0px] opacity-0 z-[-1]': !isShow,
          // '-mb-4 mobile:-mb-5 tablet:-mb-6': isShowPasswordInput === false,
        }
      )}
    >
      <div className={cx(FLEX_COL, 'gap-3')}>
        {/* Real name */}
        <FormInput
          label={{
            i18nKey: 'withdrawal_bank_account_account_holder_name_linked',
          }}
          name="realName"
          isRequired={true}
          placeholder={{
            i18nKey: 'withdrawal_bank_account_account_holder_name_placeholder',
          }}
          validator={validator.username}
          // tip={{ i18nKey: 'account_bank_account_input_notice_real_name' }}
          type={'en_name'}
          formItemProps={{ ...ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS }}
        />

        {/* Bank account */}
        <FormInput
          label={{ i18nKey: 'withdrawal_bank_account_account_number_linked' }}
          name="bankCode"
          isRequired={true}
          maxLength={30}
          placeholder={{
            i18nKey: 'withdrawal_bank_account_account_number_placeholder',
          }}
          validator={validator.bankAccount}
          repeatProps={{
            label: {
              i18nKey: 'withdrawal_bank_account_repeat_account_number_item',
            },
            name: 'repeatBankCode',
            isRequired: true,
            maxLength: 30,
            placeholder: {
              i18nKey: 'withdrawal_bank_account_account_number_placeholder',
            },
            validator: validator.bankAccount,
            triggerDisplay: 'focus',
            repeatValue: '',
            validatorRepeat: validator.repeatBankAccount,
            formItemProps: { ...ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS },
          }}
          formItemProps={{ ...ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS }}
        />

        {/* IFSC code */}
        <FormInput
          label={{ i18nKey: 'withdrawal_bank_account_ifsc_linked' }}
          name="ifsc"
          isRequired={true}
          placeholder={{
            i18nKey: 'withdrawal_bank_account_ifsc_placeholder',
          }}
          validator={validator.ifscCode}
          maxLength={11}
          repeatProps={{
            label: { i18nKey: 'withdrawal_bank_account_repeat_ifsc_item' },
            name: 'repeatIfsc',
            isRequired: true,
            maxLength: 11,
            placeholder: {
              i18nKey: 'withdrawal_bank_account_account_number_placeholder',
            },
            validator: validator.ifscCode,
            triggerDisplay: 'validator',
            repeatValue: '',
            validatorRepeat: validator.repeatIfscCode,
            formItemProps: { ...ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS },
          }}
          formItemProps={{ ...ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS }}
        />

        {/* Enter the withdrawal password */}
        {/*<FormInput*/}
        {/*  label={{*/}
        {/*    i18nKey: 'wallet_withdraw_input_hint_withdrawal_password',*/}
        {/*  }}*/}
        {/*  name="password"*/}
        {/*  isRequired={isShowPasswordInput}*/}
        {/*  classNameObj={{*/}
        {/*    container: cx({*/}
        {/*      'h-[0px]': isShowPasswordInput === false,*/}
        {/*    }),*/}
        {/*  }}*/}
        {/*  maxLength={13}*/}
        {/*  placeholder={{*/}
        {/*    i18nKey: 'wallet_withdraw_input_hint_withdrawal_password',*/}
        {/*  }}*/}
        {/*  validator={validator.password}*/}
        {/*  // tip={{*/}
        {/*  //   i18nKey: 'wallet_withdraw_password_reminder',*/}
        {/*  // }}*/}
        {/*  isVisible={isShowPasswordInput}*/}
        {/*/>*/}
      </div>
    </div>
  ) : null;
};

export default BindKYCBankAccount;
