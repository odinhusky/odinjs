import { cx, useDeepEffect } from '@libs/commonUtils';
import Form from '@mode2/components/Form';
import { useTranslation } from 'react-i18next';
import BindKYCPersonalInfo from './components/BindKYCPersonalInfo';
import BindKYCBankAccount from './components/BindKYCBankAccount';
import InfoHint from '@components/InfoHint';
import useKYC from '@/usecase/useKYC';
import {
  InitialValuesTypes,
  useKycDisplayStore,
} from '@/zustand/kyc/useKycDisplayStore';
import {
  KYCInputValidator,
  PasswordValidator,
  PhoneNumberValidator,
  UserNameValidator,
} from '@/validator/antdValidator';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import BindKYCDesktopHeader from './components/BindKYCDesktopHeader';
import { FLEX_COL } from '@libs/constant/style';
import useBindKYCPageBase from '@/ui/hooks/pages/bindKYCPage/useBindKYCPageBase';

export const BindKYCPage = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  // Validator Instances
  const UserNameValidatorInstance = UserNameValidator(t);
  const PhoneNumberValidatorInstance = PhoneNumberValidator(t);
  const PasswordValidatorInstance = PasswordValidator(t);
  const KYCInputValidatorInstance = KYCInputValidator(t);

  // pageHook
  useBindKYCPageBase();

  // usecase
  const { saveBindKYC, disabled } = useKYC();

  const isShowPersonalBlock = useKycDisplayStore(
    (state) => state.isShowPersonalBlock
  );

  const isShowBankAccountBlock = useKycDisplayStore(
    (state) => state.isShowBankAccountBlock
  );

  const defaultValues = useKycDisplayStore((state) => state.defaultValues);

  useDeepEffect(() => {
    // 使用 setFieldsValue 更新表單字段，非同步更新表單的初始值
    form.setFieldsValue(defaultValues);
  }, [defaultValues]);

  return (
    <div className={cx('py-3 mobile:py-5 tablet:py-8', FLEX_COL, 'gap-5')}>
      <BindKYCDesktopHeader />

      <div
        className={cx(
          'pb-6 px-4 mobile:px-5 tablet:px-6 pt-3 mobile:pt-5 tablet:pt-6',
          'tablet:bgi-[var(--grayscale-20)]',
          'rounded-[8px]'
        )}
      >
        <Form
          className="bind-form"
          form={form}
          onFinish={(values: InitialValuesTypes) => {
            saveBindKYC(values);
          }}
          onFinishFailed={(error) => {
            console.log('@@ fail error', error);
          }}
          initialValues={defaultValues}
        >
          <BindKYCPersonalInfo
            isShow={isShowPersonalBlock}
            isShowTitle={isShowPersonalBlock && isShowBankAccountBlock}
            validator={{
              phone: (value) => PhoneNumberValidatorInstance.phone(value),
              username: (value) => UserNameValidatorInstance.username(value),
            }}
          />

          {/* 間距元素 */}
          <div
            className={cx('w-full h-4 mobile:h-5 tablet:h-6 hidden', {
              block: isShowPersonalBlock && isShowBankAccountBlock,
            })}
          ></div>

          <BindKYCBankAccount
            isShow={isShowBankAccountBlock}
            isShowTitle={isShowPersonalBlock && isShowBankAccountBlock}
            validator={{
              username: (value) => UserNameValidatorInstance.username(value),
              bankAccount: (value) =>
                KYCInputValidatorInstance.bankAccount(value),
              ifscCode: (value) => KYCInputValidatorInstance.ifscCode(value),
              password: (value) => PasswordValidatorInstance.password(value),
            }}
          />

          <div className="btn relative z-[2] mt-4 mobile:mt-5 tablet:mt-6">
            <BasePrimaryBtn
              type="submit"
              children={t('earn_money_earn_btn_save')}
              disabled={disabled}
              debounceTimer={500}
            />
          </div>
        </Form>

        <InfoHint
          hintText={t('account_personal_info_note')}
          classNameObj={{
            containerClass: 'mt-5 tablet:mt-[26px]',
          }}
        />
      </div>
    </div>
  );
};

export default BindKYCPage;
