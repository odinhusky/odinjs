import BasePrimaryBtn from '@components/BasePrimaryBtn';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import Icon from '@components/Icon';
import { cx } from '@libs/commonUtils';
import Form from '@libs/components/Form';
import FormInput from '@libs/components/FormInput';
import BaseModal from '@libs/components/Modal';
import OTPCountDown from '@libs/components/OTPCountDown';
import {
  handleAccountPageInviteChange,
  handleAccountPageLoginPasswordChange,
  handleAccountPageModalClose,
  handleAccountPageNicknameChange,
  handleAccountPageSaveGenderClick,
} from '@libs/mode2/action/accountPageAction/acitonType';
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
  KYCValidator,
  OTPCodeValidator,
  PasswordValidator,
} from '@/validator/antdValidator';
import { useAccount } from '@/usecase/useAccount';

// TODO i18n
export const AccountModal = () => {
  const { t } = useTranslation();
  const { handleAccountPageClick } = useAccountPageAction();

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

  const [form] = Form.useForm();

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
    <BaseModal>
      <div
        className={cx(
          'w-[90%] max-w-[408px] p-4 box-border rounded-xl bgi-[var(--base-2-variant9)] border border-[var(--base-1-main)]'
        )}
      >
        <div className="flex justify-between items-center">
          <div className="text-lg font-medium">{modalTitle}</div>
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
          onFinish={onFinish}
          onFinishFailed={(error) => {
            console.log(error);
          }}
          initialValues={{ ...loginForm, nickname: nickname }}
        >
          {modalTitle === AccountPageModalTitleTypes.NICKNAME ? (
            <div className="mt-11">
              <FormInput
                name="nickname"
                styles={{
                  containerDiv: '!py-4 !bgi-[var(--base-2-variant6)]',
                }}
                placeholder={{
                  i18nKey: '',
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
                onValidator={(_, value) => KYCValidator.username(value, t)}
              />
              <div className="mt-8 flex justify-center">
                <BasePrimaryBtn
                  children={'Save'}
                  className="w-40 text-lg font-medium"
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
                  containerDiv: '!py-3.5 !bgi-[var(--base-2-variant6)]',
                }}
                // TODO i18n
                placeholder={{
                  i18nKey: 'Please enter the invitation code',
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
                maxLength={10} // TODO Ronan length 待確認
                prefix={<Icon name="ic_add" className="w-7 h-7" />}
                onValidator={(_, value) =>
                  CommonEmptyValidator.inputValue(value, t)
                }
              />
              <div className="bgi-text-[var(--base-2-variant1)]">
                Only allowed to enter once!
              </div>

              <div className="mt-8 flex gap-4">
                <BaseSecondaryBtn
                  children={'Cancel'}
                  className="text-lg font-medium flex-1"
                  onClick={() => {
                    handleAccountPageClick({
                      actionName: handleAccountPageModalClose,
                    });
                  }}
                />
                <BasePrimaryBtn
                  children={'Confirm'}
                  className="text-lg font-medium flex-1"
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
                styles={{
                  containerDiv: '!py-3.5 !bgi-[var(--base-2-variant6)]',
                }}
                // TODO i18n
                placeholder={{
                  i18nKey: 'Enter your phone no.',
                }}
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
                suffix={
                  <OTPCountDown
                    currentKey={OTPCountDownKeys.OTP_LOGIN}
                    className="active:transition active:duration-300 active:scale-95 !bgi-[var(--base-2-variant5)] shadow-[var(--box-shadow)]"
                  />
                }
                onValidator={(_, value) => KYCValidator.phone(value, t)}
              />
              <FormInput
                name="otpCode"
                styles={{
                  containerDiv: '!py-3.5 !bgi-[var(--base-2-variant6)]',
                }}
                // TODO i18n
                placeholder={{
                  i18nKey: 'Enter the received verification code',
                }}
                value={loginForm.otpCode}
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
                onValidator={(_, value) => OTPCodeValidator(t).otpCode(value)}
              />
              <FormInput
                name="password"
                type={passwordVisibility.password ? 'text' : 'password'}
                styles={{
                  containerDiv: '!py-3.5 !bgi-[var(--base-2-variant6)]',
                }}
                // TODO i18n
                placeholder={{
                  i18nKey: 'Enter between 8 and 32 characters',
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
                onValidator={(_, value) => PasswordValidator(t).password(value)}
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
              />
              <FormInput
                name="confirmPassword"
                type={passwordVisibility.confirmPassword ? 'text' : 'password'}
                styles={{
                  containerDiv: '!py-3.5 !bgi-[var(--base-2-variant6)]',
                }}
                // TODO i18n
                placeholder={{
                  i18nKey: 'Enter the modified password again',
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
                  PasswordValidator(t).confirmPassword(
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
              />

              <div className="mt-8 flex justify-center">
                <BasePrimaryBtn
                  children={'Complete'}
                  className="w-40 text-lg font-medium"
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
