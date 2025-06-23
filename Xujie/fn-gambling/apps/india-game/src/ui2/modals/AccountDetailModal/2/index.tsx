import BasePrimaryBtn from '@components/BasePrimaryBtn';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import Icon from '@components/Icon';
import { cx } from '@libs/commonUtils';
import Form from '@libs/components/Form';
import FormInput from '@libs/components/FormInput';
import BaseModal from '@libs/components/Modal';
import OTPCountDown from '@components/OTPCountDown';
import {
  handleAccountPageInviteChange,
  handleAccountPageLoginPasswordChange,
  handleAccountPageModalClose,
  handleAccountPageNicknameChange,
  handleAccountPageSaveGenderClick,
} from '@mode2/action/actionTypes';
import useAccountPageAction from '@libs/mode2/action/accountPageAction/useAccountPageAction';
import { OTPCountDownKeys } from '@libs/mode2/zustand/components/OTPCountDownStore';
import {
  AccountFormValues,
  AccountPageGenderTypes,
  AccountPageModalTitleTypes,
  useAccountPageStore,
} from '@libs/mode2/zustand/page/accountPageStore';
import { useTranslation } from 'react-i18next';
import {
  CommonEmptyValidator,
  OTPCodeValidator,
  PasswordValidator,
  PhoneNumberValidator,
  NickNameValidator,
} from '@/validator/antdValidator';
import { useAccount } from '@/usecase/useAccount';
import './index.scss';
import { useMessageStore } from '@libs/mode2/zustand/components/messageStore';
import {
  ANTD_FORM_VALIDATE_WHEN_SUBMIT_PROPS,
  ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS,
} from '@constant/options';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { FLEX_CENTER } from '@libs/constant/style';
import { useEffect } from 'react';

export const AccountDetailModal = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  // Validator Instances
  const CommonEmptyValidatorInstance = CommonEmptyValidator(t);
  const PhoneNumberValidatorInstance = PhoneNumberValidator(t);
  const PasswordValidatorInstance = PasswordValidator(t);
  const OTPCodeValidatorInstance = OTPCodeValidator(t);
  const NickNameValidatorInstance = NickNameValidator(t);

  const { handleAccountPageClick } = useAccountPageAction();

  const realPhone = useUserProfileStore((state) => state.realPhone);
  const isShowEditModal = useAccountPageStore((state) => state.isShowEditModal);
  const modalTitle = useAccountPageStore((state) => state.modalTitle);
  const gender = useAccountPageStore((state) => state.gender);
  const nickname = useAccountPageStore((state) => state.nickname);
  const loginForm = useAccountPageStore((state) => state.loginForm);
  const referCode = useAccountPageStore((state) => state.referCode);
  const passwordVisibility = useAccountPageStore(
    (state) => state.passwordVisibility
  );
  const togglePasswordVisibility = useAccountPageStore(
    (state) => state.togglePasswordVisibility
  );

  const { editNickname, bindInviteCode, bindPassword } = useAccount();

  const genderList = [
    AccountPageGenderTypes.MALE,
    AccountPageGenderTypes.FEMALE,
  ];

  const onFinish = (values: AccountFormValues) => {
    if (modalTitle === AccountPageModalTitleTypes.NICKNAME) {
      editNickname({ nickname });
    }

    if (modalTitle === AccountPageModalTitleTypes.INVITE_CODE) {
      bindInviteCode({ referCode });
    }

    if (modalTitle === AccountPageModalTitleTypes.PASSWORD) {
      bindPassword(loginForm);
    }
  };

  const getCurrentMobile = () => {
    const currentMobile = form.getFieldValue('phone');
    return currentMobile;
  };

  useEffect(() => {
    if (isShowEditModal === false) {
      form.resetFields();
      useAccountPageStore.getState().setLoginForm({
        phone: '',
        otpCode: '',
        password: '',
        confirmPassword: '',
      });
      useAccountPageStore.getState().setReferCode('');
    }
  }, [isShowEditModal]);

  // 性別選擇
  const Gender = () => {
    return (
      <div className="py-11 font-medium flex justify-around">
        {genderList.map((item, index) => {
          return (
            <div
              className="text-center cursor-pointer"
              key={index}
              onClick={() => {
                handleAccountPageClick({
                  actionName: handleAccountPageSaveGenderClick,
                  payload: { gender: item },
                });
              }}
            >
              <div
                className={cx(
                  'p-3 box-border mb-2 rounded-full bgi-[var(--base-2-variant8)]',
                  'border border-transparent active:border-[var(--base-1-main)]',
                  {
                    'border-[var(--base-1-main)]': item === gender,
                  }
                )}
              >
                <Icon
                  name={`ic_${item.toLocaleLowerCase()}`}
                  className="w-12 h-12"
                />
              </div>
              <span className="text-base bgi-text-[var(--base-2-variant1)]">
                {item}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return isShowEditModal ? (
    <BaseModal className="bgi-[var(--transparent-gray-90)]">
      <div
        className={cx(
          'w-[90%] max-w-[408px] p-4 box-border rounded-xl bgi-[var(--base-2-variant9)] border border-[var(--base-1-main)]'
        )}
      >
        <div
          className={cx(
            'pb-3',
            'flex justify-between items-center',
            'border-b border-[var(--transparent-white-10)]'
          )}
        >
          <div className="text-lg font-medium bgi-text-[var(--grayscale-100)]">
            {modalTitle}
          </div>
          <button
            onClick={() => {
              handleAccountPageClick({
                actionName: handleAccountPageModalClose,
              });
            }}
          >
            <Icon name="ic_close" className="w-6 h-6" />
          </button>
        </div>

        {/* 編輯暱稱 */}
        <Form<AccountFormValues & Record<string, unknown>>
          form={form}
          {...ANTD_FORM_VALIDATE_WHEN_SUBMIT_PROPS}
          onFinish={onFinish}
          onFinishFailed={(errorInfo) => {
            console.log(errorInfo);
            const message = errorInfo?.errorFields?.[0]?.errors?.[0] || '';
            if (message) useMessageStore.getState().info(message);
          }}
          initialValues={{ ...loginForm, nickname: nickname }}
        >
          {modalTitle === AccountPageModalTitleTypes.NICKNAME ? (
            <div className="mt-11">
              <FormInput
                name="nickname"
                styles={{
                  input: 'input !px-0',
                  containerDiv: '!py-4 !px-3 !bgi-[var(--base-2-variant6)]',
                }}
                placeholder={{
                  i18nKey: 'profile_my_info_edit_nickname_placeholder',
                }}
                required={true}
                isShowStar={false}
                value={nickname}
                maxLength={20}
                onChange={(e) => {
                  handleAccountPageClick({
                    actionName: handleAccountPageNicknameChange,
                    payload: { value: e },
                  });
                }}
                onValidator={(_, value) =>
                  NickNameValidatorInstance.nickname(value)
                }
                formItemProps={{ ...ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS }}
              />
              <div className="mt-8 flex justify-center">
                <BasePrimaryBtn
                  children={'Save'}
                  className="w-40 !h-12 text-lg font-medium"
                  onClick={form.submit}
                />
              </div>
            </div>
          ) : null}

          {/* 綁定邀請碼 */}
          {modalTitle === AccountPageModalTitleTypes.INVITE_CODE ? (
            <div className="mt-8">
              <FormInput
                name="referCode"
                styles={{
                  input: 'input !px-0',
                  inputPrefix: '!border-0',
                  containerDiv: '!py-3.5 !px-3 !bgi-[var(--base-2-variant6)]',
                }}
                placeholder={{
                  i18nKey:
                    'profile_my_info_bind_invitation_code_enter_invitation_code_placeholder',
                }}
                required={true}
                isShowStar={false}
                value={referCode}
                onChange={(e) => {
                  handleAccountPageClick({
                    actionName: handleAccountPageInviteChange,
                    payload: { value: e },
                  });
                }}
                maxLength={10}
                prefix={<Icon name="ic_add" className="w-7 h-7" />}
                onValidator={(_, value) =>
                  CommonEmptyValidatorInstance.inputValue(value)
                }
                formItemProps={{ ...ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS }}
              />
              <div className="bgi-text-[var(--base-2-variant1)]">
                {t(
                  'profile_my_info_bind_invitation_code_enter_invitation_code_helper_text'
                )}
              </div>

              <div className="mt-8 flex gap-4">
                <BaseSecondaryBtn
                  children={'Cancel'}
                  className="text-lg !h-12 font-medium flex-1"
                  onClick={() => {
                    handleAccountPageClick({
                      actionName: handleAccountPageModalClose,
                    });
                  }}
                />
                <BasePrimaryBtn
                  children={'Confirm'}
                  className="text-lg !h-12 font-medium flex-1"
                  onClick={form.submit}
                />
              </div>
            </div>
          ) : null}

          {/* 設定密碼 */}
          {modalTitle === AccountPageModalTitleTypes.PASSWORD ? (
            <div className="mt-8 flex flex-col gap-5">
              <FormInput
                name="phone"
                type="number"
                styles={{
                  input: 'input',
                  inputPrefix: '!bgi-border-[var(----transparent-white-10)]',
                  containerDiv: '!py-3.5 !px-3 !bgi-[var(--base-2-variant6)]',
                }}
                placeholder={{
                  i18nKey:
                    'profile_my_info_bind_phone_number_enter_phone_number_placeholder',
                }}
                disabled={realPhone ? true : false}
                required={true}
                isShowStar={false}
                maxLength={11}
                value={loginForm.phone}
                onChange={(e) => {
                  handleAccountPageClick({
                    actionName: handleAccountPageLoginPasswordChange,
                    payload: { value: e, type: 'phone' },
                  });
                }}
                prefix={
                  <div className="flex items-center ">
                    <Icon name="ic_smartphone" className="w-7 h-7" />
                    <span className="bgi-text-[var(--transparent-white-70)]">
                      {t('common_area_code')}
                    </span>
                  </div>
                }
                onValidator={(_, value) =>
                  PhoneNumberValidatorInstance.phone(value)
                }
                formItemProps={{ ...ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS }}
              />

              <FormInput
                name="otpCode"
                styles={{
                  input: 'input !px-0',
                  inputPrefix: '!border-0',
                  containerDiv: '!py-3.5 !px-3 !bgi-[var(--base-2-variant6)]',
                }}
                placeholder={{
                  i18nKey:
                    'profile_my_info_set_login_password_enter_verification_code_placeholder',
                }}
                value={loginForm.otpCode}
                type="number"
                required={true}
                maxLength={6}
                isShowStar={false}
                onChange={(e) => {
                  handleAccountPageClick({
                    actionName: handleAccountPageLoginPasswordChange,
                    payload: { value: e, type: 'otpCode' },
                  });
                }}
                prefix={
                  <Icon name="ic_verification_code" className="w-7 h-7" />
                }
                suffix={
                  <OTPCountDown
                    currentKey={OTPCountDownKeys.SET_OTP_LOGIN}
                    getMobileFn={getCurrentMobile}
                    btnClassName="w-16 h-7"
                    className={cx(
                      'w-16 px-0 rounded-md !bg-transparent',
                      FLEX_CENTER
                    )}
                    showUnit={false}
                    i18nKey="forgot_password_verification_code_sent_toast"
                  />
                }
                onValidator={(_, value) =>
                  OTPCodeValidatorInstance.otpCode(value)
                }
                formItemProps={{ ...ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS }}
              />

              <FormInput
                name="password"
                type={passwordVisibility.password ? 'text' : 'password'}
                styles={{
                  input: 'input !px-0',
                  inputPrefix: '!border-0',
                  containerDiv: '!py-3.5 !px-3 !bgi-[var(--base-2-variant6)]',
                }}
                placeholder={{
                  i18nKey: 'sign_up_sign_in_password_format_error_toast',
                }}
                value={loginForm.password}
                required={true}
                isShowStar={false}
                onChange={(e) => {
                  handleAccountPageClick({
                    actionName: handleAccountPageLoginPasswordChange,
                    payload: { value: e, type: 'password' },
                  });
                }}
                maxLength={13}
                onValidator={(_, value) =>
                  PasswordValidatorInstance.password(value)
                }
                prefix={<Icon name="ic_lock_1" className="w-7 h-7" />}
                suffix={
                  <Icon
                    name={
                      passwordVisibility.password ? 'ic_eye_on' : 'ic_eye_off'
                    }
                    className="w-7 h-7"
                    onClick={() => {
                      togglePasswordVisibility('password');
                    }}
                  />
                }
                formItemProps={{ ...ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS }}
              />

              <FormInput
                name="confirmPassword"
                type={passwordVisibility.confirmPassword ? 'text' : 'password'}
                styles={{
                  input: 'input !px-0',
                  inputPrefix: '!border-0',
                  containerDiv: '!py-3.5 !px-3 !bgi-[var(--base-2-variant6)]',
                }}
                placeholder={{
                  i18nKey:
                    'profile_my_info_set_login_password_confirm_password_placeholder',
                }}
                value={loginForm.confirmPassword}
                required={true}
                maxLength={13}
                isShowStar={false}
                onChange={(e) => {
                  handleAccountPageClick({
                    actionName: handleAccountPageLoginPasswordChange,
                    payload: { value: e, type: 'confirmPassword' },
                  });
                }}
                onValidator={(_, value) =>
                  PasswordValidatorInstance.confirmPassword(
                    value,
                    form.getFieldValue
                  )
                }
                prefix={<Icon name="ic_lock_1" className="w-7 h-7" />}
                suffix={
                  <Icon
                    name={
                      passwordVisibility.confirmPassword
                        ? 'ic_eye_on'
                        : 'ic_eye_off'
                    }
                    className="w-7 h-7"
                    onClick={() => {
                      togglePasswordVisibility('confirmPassword');
                    }}
                  />
                }
                formItemProps={{ ...ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS }}
              />

              <div className="mt-3 flex justify-center">
                <BasePrimaryBtn
                  children={'Complete'}
                  className="w-40 !h-12 text-lg font-medium"
                  onClick={form.submit}
                />
              </div>
            </div>
          ) : null}
        </Form>

        {/* 編輯性別 */}
        {modalTitle === AccountPageModalTitleTypes.GENDER ? <Gender /> : null}
      </div>
    </BaseModal>
  ) : null;
};

export default AccountDetailModal;
