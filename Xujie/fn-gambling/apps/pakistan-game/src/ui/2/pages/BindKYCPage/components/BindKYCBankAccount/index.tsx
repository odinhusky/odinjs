import { FormInput } from '../FormInput';
import FormTitle from '../FormTitle';
import { useKycDisplayStore } from '@/zustand/kyc/useKycDisplayStore';
import { cx } from '@libs/commonUtils';
import { FLEX_COL, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import BankAccountTabs from '../BankAccountTabs';
import { useBindKYCPageDiffStore } from '@/zustand/page/bindKYCPageDiffStore';
import { FormSelect } from '../FormSelect';

interface BindKYCBankAccountProps {
  isShowTitle: boolean;
  validator: {
    username: (value: string) => Promise<void> | undefined;
    walletAccount: (value: string) => Promise<void> | undefined;
    bankAccountNumber: (value: string) => Promise<void> | undefined;
    bankName: (value: string) => Promise<void> | undefined;
    cnicCode: (value: string) => Promise<void> | undefined;
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

  // diff
  const activeBankAccountTab = useBindKYCPageDiffStore(
    (state) => state.activeBankAccountTab
  );
  const isOtherBanks = activeBankAccountTab.code === 'OTHER_BANKS';

  const bankAccountSelectOptions = useBindKYCPageDiffStore(
    (state) => state.bankAccountSelectOptions
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
      {/* Tabs */}
      <div
        className={cx(
          'mb-4 mobile:mb-5 tablet:mb-6',
          '-mx-8 mobile:-mx-10 tablet:-mx-0'
        )}
      >
        <BankAccountTabs />
      </div>

      <div className={cx(FLEX_COL, 'gap-4 mobile:gap-5 tablet:gap-6')}>
        {/* Real name | Full name | Cardholder name */}
        <FormInput
          label={{
            i18nKey: isOtherBanks
              ? 'account_bank_account_input_title_cardholder_name'
              : 'account_bank_account_input_title_real_name',
          }}
          name="realName"
          isRequired={true}
          placeholder={{
            i18nKey: 'account_personal_info_input_hint_only_fill_and_english',
          }}
          classNameObj={{
            input: cx('!pl-0'),
          }}
          validator={validator.username}
          // tip={{ i18nKey: 'account_bank_account_input_notice_real_name' }}
          type={'en_name'}
        />

        {/* Bank Name */}
        {isOtherBanks ? (
          <FormSelect
            label={{ i18nKey: 'account_bank_account_input_title_bank_name' }}
            name="bankName"
            isRequired={true}
            placeholder={{
              i18nKey: 'account_bank_account_input_hint_enter_your_bank_name',
            }}
            validator={validator.bankName}
            options={bankAccountSelectOptions.map((item) => ({
              ...item,
              label: (
                <div className="form-select-option">
                  <span className="form-select-option-text">{item.label}</span>
                </div>
              ),
            }))}
          />
        ) : (
          <FormInput
            label={{ i18nKey: 'account_bank_account_input_title_bank_name' }}
            name="bankName"
            isRequired={true}
            isDisabled={true}
            classNameObj={{
              input: cx('!pl-0'),
            }}
            validator={validator.bankName}
          />
        )}

        {/* Bank account  */}
        <div className={cx(FLEX_ITEMS_CENTER, 'w-full')}>
          <FormInput
            type="number"
            label={{
              i18nKey: isOtherBanks
                ? 'account_bank_account_input_title_account_number'
                : 'account_bank_account_input_title_wallet_account',
            }}
            name="bankCode"
            classNameObj={{
              container: 'w-full',
              input: cx({ '!pl-0': isOtherBanks }),
            }}
            isRequired={true}
            maxLength={isOtherBanks ? undefined : 9}
            placeholder={{
              i18nKey: isOtherBanks
                ? 'account_bank_account_input_hint_enter_account_number'
                : 'account_bank_account_input_hint_enter_wallet_account_number',
            }}
            prefix={
              !isOtherBanks ? (
                <div className={cx()}>
                  <span
                    className={cx('bgi-text-[var(--grayscale-100)] text-base')}
                  >
                    {'03'}
                  </span>
                </div>
              ) : undefined
            }
            validator={
              isOtherBanks
                ? validator.bankAccountNumber
                : validator.walletAccount
            }
          />
        </div>

        {/* CNIC code */}
        <FormInput
          label={{ i18nKey: 'wallet_withdraw_bank_account_unique_id_codes' }}
          name="cnic"
          isRequired={true}
          placeholder={{
            i18nKey: 'account_bank_account_input_hint_enter_unique_id_codes',
          }}
          classNameObj={{
            input: cx('!pl-0'),
          }}
          validator={validator.cnicCode}
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
            input: cx('!pl-0'),
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
