import { cx, useDeepEffect } from '@libs/commonUtils';
import Form from '@mode2/components/Form';
import { useTranslation } from 'react-i18next';
import BindKYCBankAccount, {
  BindKYCBankAccountValidator,
} from './components/BindKYCBankAccount';
import InfoHint from '@components/InfoHint';
import useKYC from '@/usecase/useKYC';
import {
  InitialValuesTypes,
  useKycDisplayStore,
} from '@/zustand/kyc/useKycDisplayStore';
import {
  KYCInputValidator,
  PasswordValidator,
  UserNameValidator,
} from '@/validator/antdValidator';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@libs/constant/style';
import { useCallback, useEffect, useState } from 'react';
import { useWalletPageStore } from '@mode2/zustand/page/WalletPage/walletPageStore';
import { WalletDashboardType } from '@mode2/@types/walletDashboardTypes';
import useMobileExclusiveBindKYCPageOverride from './useMobileExclusiveBindKYCPageOverride';
import BindKYCConfirmModal, {
  BindKYCConfirmProps,
} from './modals/BindKYCConfirmModal';
import { useMessageStore } from '@libs/mode2/zustand/components/messageStore';
import { ANTD_FORM_VALIDATE_WHEN_SUBMIT_PROPS } from '@constant/options';

export const BindKYCPage = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  // pageHook

  useMobileExclusiveBindKYCPageOverride();

  useEffect(() => {
    return () => {
      useWalletPageStore
        .getState()
        .setDisplayDashboardType(WalletDashboardType.NONE);
    };
  }, []);

  // Validator Instances
  const UserNameValidatorInstance = UserNameValidator(t);
  const KYCInputValidatorInstance = KYCInputValidator(t);
  const PasswordValidatorInstance = PasswordValidator(t);

  // TODO I18N
  const validator: BindKYCBankAccountValidator = {
    username: (value) =>
      UserNameValidatorInstance.username(value.trimStart().trimEnd(), {
        emptyI18nKey: 'Account Holder Name cannot be empty',
      }),
    bankAccount: (value) =>
      KYCInputValidatorInstance.bankAccount(value.trimStart().trimEnd(), {
        emptyI18nKey: 'Account Number cannot be empty',
      }),
    repeatBankAccount: (value) =>
      KYCInputValidatorInstance.repeatBankAccount(
        value.trimStart().trimEnd(),
        form.getFieldValue,
        {
          unValidateI18nKey: 'Account Number is inconsistent',
        }
      ),
    ifscCode: (value) =>
      KYCInputValidatorInstance.ifscCode(value.trimStart().trimEnd(), {
        emptyI18nKey: 'IFSC cannot be empty',
      }),
    repeatIfscCode: (value) =>
      KYCInputValidatorInstance.repeatIfscCode(
        value.trimStart().trimEnd(),
        form.getFieldValue,
        {
          unValidateI18nKey: 'IFSC is inconsistent',
        }
      ),
    password: (value) => PasswordValidatorInstance.password(value),
    // password: (value) => Promise.resolve(),
  };

  // usecase
  const { saveBindKYC, disabled } = useKYC();

  const [bindKYCConfirmModalState, setBindKYCConfirmModalState] =
    useState<BindKYCConfirmProps>({ isShow: false });

  // const isShowPersonalBlock = useKycDisplayStore(
  //   (state) => state.isShowPersonalBlock
  // );

  const isShowBankAccountBlock = useKycDisplayStore(
    (state) => state.isShowBankAccountBlock
  );

  const defaultValues = useKycDisplayStore((state) => state.defaultValues);

  useDeepEffect(() => {
    // 使用 setFieldsValue 更新表單字段，非同步更新表單的初始值
    form.setFieldsValue(defaultValues);
  }, [defaultValues]);

  const handleConfirmClick = useCallback(() => {
    //  去不不必要的 form value
    const { repeatIfsc, repeatBankCode, realName, bankCode, ifsc, ...rest } =
      form.getFieldsValue();
    console.log('@@@===>allValues'); // 取得整個表單的值
    const valuesTypes: InitialValuesTypes = {
      ...rest,
      realName: `${realName}`.trimStart().trimEnd(),
      bankCode: `${bankCode}`.trimStart().trimEnd(),
      ifsc: `${ifsc}`.trimStart().trimEnd(),
    };
    console.log('@@@===> valuesTypes', valuesTypes); // 取得整個表單的值
    setBindKYCConfirmModalState({
      isShow: true,
      values: valuesTypes,
      onPrimaryCallback: () => {
        saveBindKYC(valuesTypes);
        setBindKYCConfirmModalState({ isShow: false });
      },
      onSecondaryCallback: () => {
        setBindKYCConfirmModalState({ isShow: false });
      },
      onCloseCallback: () => {
        setBindKYCConfirmModalState({ isShow: false });
      },
    });
  }, [form]);

  return (
    <div
      className={cx(
        'w-screen',
        ' h-screen',
        'relative flex flex-col bgi-[var(--background-light)]',
        MOBILE_BREAK_POINT_MAX_WIDTH,
        '-mx-4 py-4 px-5'
      )}
    >
      {/*<BindKYCDesktopHeader />*/}

      <div
        className={
          cx()
          // 'pb-6 px-4',
          // 'tablet:bgi-[var(--grayscale-20)]',
          // 'rounded-[8px]'
        }
      >
        <Form
          className="bind-form"
          form={form}
          {...ANTD_FORM_VALIDATE_WHEN_SUBMIT_PROPS}
          onFinish={(values: InitialValuesTypes) => {
            // saveBindKYC(values);
            handleConfirmClick();
          }}
          onFinishFailed={(errorInfo) => {
            console.log('@@ fail errorInfo', errorInfo);
            const message = errorInfo?.errorFields?.[0]?.errors?.[0] || '';
            if (message) useMessageStore.getState().info(message);
          }}
          initialValues={defaultValues}
          labelCol={{ span: 24 }} // label 佔滿一整行
          wrapperCol={{ span: 24 }} // Input 佔滿一整行
          requiredMark={false}
        >
          {/*<BindKYCPersonalInfo*/}
          {/*  isShow={isShowPersonalBlock}*/}
          {/*  isShowTitle={isShowPersonalBlock && isShowBankAccountBlock}*/}
          {/*  validator={{*/}
          {/*    phone: (value) => KYCValidator.phone(value, t),*/}
          {/*    username: (value) => KYCValidator.username(value, t),*/}
          {/*  }}*/}
          {/*/>*/}

          {/* 間距元素 */}
          {/*<div*/}
          {/*  className={cx('w-full h-4 mobile:h-5 tablet:h-6 hidden', {*/}
          {/*    block: isShowPersonalBlock && isShowBankAccountBlock,*/}
          {/*  })}*/}
          {/*></div>*/}

          <div
            className={cx(
              'w-full',
              'bgi-[var(--transparent-white-10)]',
              'flex flex-col gap-4',
              'py-3 px-5',
              'border bgi-border-[var(--transparent-white-20)] rounded-md'
            )}
          >
            <BindKYCBankAccount
              isShow={true}
              isShowTitle={true}
              validator={validator}
            />

            <BasePrimaryBtn
              type="submit"
              className="h-[46px] text-xl font-medium"
              children={t('withdrawal_bank_account_save_button')}
              disabled={disabled}
            />

            <InfoHint
              hintText={t('account_personal_info_note')}
              classNameObj={{
                containerClass: '',
              }}
            />
          </div>

          {/*<div className="btn relative z-[2] mt-4 mobile:mt-5 tablet:mt-6">*/}
          {/*  <BasePrimaryBtn*/}
          {/*    type="submit"*/}
          {/*    children={t('earn_money_earn_btn_save')}*/}
          {/*    disabled={disabled}*/}
          {/*    debounceTimer={500}*/}
          {/*  />*/}
          {/*</div>*/}
        </Form>

        {/*<InfoHint*/}
        {/*  hintText={t('account_personal_info_note')}*/}
        {/*  classNameObj={{*/}
        {/*    containerClass: 'mt-5 tablet:mt-[26px]',*/}
        {/*  }}*/}
        {/*/>*/}
      </div>

      <BindKYCConfirmModal {...bindKYCConfirmModalState} />
    </div>
  );
};

export default BindKYCPage;
