import { useTranslation } from 'react-i18next';
import useLoginForm, { ILoginModalProps } from '@/hooks/modals/useLoginForm';
import Form from '@mode2/components/Form';
import Input from '@mode2/components/Input';

import { LoginPayload } from '@mode2API/endpoint/user/PostLoginEndpoint';
import { handleForgotPasswordActionClick } from '@mode2/action/actionTypes';
import { useIsShowLoginModalStore } from '@mode2/zustand/loginStore';
import useHeaderAction from '@mode2/action/components/header/headerAction';
import Icon from '@components/Icon';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { cx, useDeepEffect } from '@libs/commonUtils';
import {
  ANTD_FORM_VALIDATE_WHEN_SUBMIT_PROPS,
  ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS,
} from '@constant/options';
import { useMessageStore } from '@libs/mode2/zustand/components/messageStore';
import sdkUtils from '@mode2/utils/sdk';

const LoginForm = (props: ILoginModalProps) => {
  const {
    form,
    login,
    isSubmitDisable,
    isPasswordVisible,
    togglePasswordVisibility,
  } = useLoginForm(props);

  const { handleHeaderClick } = useHeaderAction();
  const { t } = useTranslation();

  const referralCode = useIsShowLoginModalStore((state) => state.referralCode);

  useDeepEffect(() => {
    form.setFieldsValue({
      referralCode: sdkUtils.getAppReferralCode() || referralCode,
    });
  }, [referralCode]);

  return (
    <Form<LoginPayload & Record<string, unknown>>
      form={form}
      className="login-form"
      {...ANTD_FORM_VALIDATE_WHEN_SUBMIT_PROPS}
      onFinish={login}
      onFinishFailed={(errorInfo) => {
        const message = errorInfo?.errorFields?.[0]?.errors?.[0] || '';
        if (message) useMessageStore.getState().info(message);
      }}
      initialValues={{
        referralCode,
      }}
    >
      <Form.Item
        name="phone"
        rules={[
          {
            required: true,
            validator: (_, value) => {
              if (!value) {
                return Promise.reject(t('sign_up_sign_in_phone_error_toast'));
              }
              return Promise.resolve();
            },
          },
        ]}
        {...ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS}
      >
        <Input
          type="number"
          maxLength={11}
          styles={{
            inputPrefix: '!bgi-border-[var(----transparent-white-10)]',
            containerDiv:
              '!py-3.5 !px-3 !bgi-[var(--base-2-variant6)] mb-0 pb-0',
          }}
          placeholder={{
            i18nKey:
              'profile_my_info_set_login_password_enter_phone_number_placeholder',
          }}
          prefix={
            <div className="phone-prefix text-sm flex items-center ">
              <Icon name="ic_smartphone" className="w-7 h-7" />
              <span className="bgi-text-[var(--transparent-white-70)]">
                {t('common_area_code')}
              </span>
            </div>
          }
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            // message: t('toast_password_cannot_be_empty'),
            validator: (_, value) => {
              if (!value) {
                return Promise.reject(
                  t('sign_up_sign_in_password_error_toast')
                );
              }
              // if (value.length < 8 || value.length > 32) {
              //   return Promise.reject(
              //     t('sign_up_sign_in_password_format_error_toast')
              //   );
              // }
              return Promise.resolve();
            },
          },
        ]}
        {...ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS}
      >
        <Input
          type={isPasswordVisible ? 'text' : 'no_rules_password'}
          styles={{
            inputPrefix: '!border-0',
            containerDiv: '!py-3.5 !px-3 !bgi-[var(--base-2-variant6)]',
          }}
          prefix={<Icon className="w-7 h-7" name="ic_lock_1" />}
          placeholder={{
            i18nKey: 'sign_up_sign_in_input_password_placeholder',
          }}
          suffix={
            <Icon
              name={isPasswordVisible ? 'ic_eye_on' : 'ic_eye_off'}
              className="w-7 h-7"
              onClick={togglePasswordVisibility}
            />
          }
        />
      </Form.Item>
      <Form.Item
        name="referralCode"
        rules={[
          {
            required: false,
          },
        ]}
        {...ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS}
      >
        <Input
          type="text"
          styles={{
            inputPrefix: '!border-0',
            containerDiv: '!py-3.5 !px-3 !bgi-[var(--base-2-variant6)]',
          }}
          prefix={<Icon name="ic_add" className="w-7 h-7" />}
          placeholder={{ i18nKey: 'login_referral_code_optional' }}
          maxLength={10}
          // suffix={
          //   <div
          //     onClick={(e) => {
          //       e.preventDefault();
          //       e.stopPropagation();
          //     }}
          //   >
          //     <QuestionTooltip
          //       placement="topRight"
          //       offset={[12.5, -7]}
          //       title={t('login_referral_code_reward_tips')}
          //       iconClassName="w-6 h-6"
          //       overlayClassName=""
          //       btnClassName="!p-0"
          //       color="var(--base-2-vriant11"
          //       iconName="ic_tips_2_fill_1"
          //     />
          //   </div>
          // }
        />
      </Form.Item>
      <div className="flex justify-end">
        <BasePrimaryBtn
          type="button"
          className={cx(
            '!bg-none w-auto',
            'text-sm bgi-text-[var(--grayscale-100)] underline underline-offset-8 cursor-pointer'
          )}
          classNameText="bgi-text-[var(--grayscale-100)]"
          debounceTimer={500}
          disabled={isSubmitDisable}
          onClick={() => {
            handleHeaderClick({
              actionName: handleForgotPasswordActionClick,
            });
          }}
        >
          {t('sign_in_link_forgot_password')}
        </BasePrimaryBtn>
      </div>
      <BasePrimaryBtn
        type="submit"
        className={cx('text-lg', 'font-medium', 'h-14 px-4', 'mt-6')}
        disabled={isSubmitDisable}
        debounceTimer={500}
        //
        children={<div>Sign Up/Sign In</div>}
      />
    </Form>
  );
};
export default LoginForm;
