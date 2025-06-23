import { useTranslation } from 'react-i18next';
import useLoginForm, { ILoginModalProps } from '@/hooks/modals/useLoginForm';
import Form from '@mode2/components/Form';
import Input from '@mode2/components/Input';
import { LoginPayload } from '@mode2API/endpoint/user/PostLoginEndpoint';
import { useIsShowLoginModalStore } from '@mode2/zustand/loginStore';
import Icon from '@components/Icon';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { cx, useDeepEffect } from '@libs/commonUtils';
import OTPCountDown from '@components/OTPCountDown';
import { OTPCountDownKeys } from '@libs/mode2/zustand/components/OTPCountDownStore';
import { useMessageStore } from '@libs/mode2/zustand/components/messageStore';
import {
  ANTD_FORM_VALIDATE_WHEN_SUBMIT_PROPS,
  ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS,
} from '@constant/options';
import sdkUtils from '@mode2/utils/sdk';

const OTPLoginForm = (props: ILoginModalProps) => {
  const { form, optLogin, isSubmitDisable } = useLoginForm(props);

  const { t } = useTranslation();

  const referralCode = useIsShowLoginModalStore((state) => state.referralCode);

  useDeepEffect(() => {
    form.setFieldsValue({
      referralCode: sdkUtils.getAppReferralCode() || referralCode,
    });
  }, [referralCode]);

  const getCurrentMobile = () => {
    const currentMobile = form.getFieldValue('phone');
    return currentMobile;
  };

  return (
    <Form<LoginPayload & Record<string, unknown>>
      form={form}
      className="login-form"
      {...ANTD_FORM_VALIDATE_WHEN_SUBMIT_PROPS}
      onFinish={optLogin}
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
            containerDiv: '!py-3.5 !px-3 !bgi-[var(--base-2-variant6)]',
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
        name="verifyCode"
        rules={[
          {
            required: true,
            // message: t('bind_phone_number_verification_code_placeholder'),
            validator: (_, value) => {
              if (!value) {
                return Promise.reject(
                  t('sign_up_sign_in_verification_code_empty_toast')
                );
              }
              return Promise.resolve();
            },
          },
        ]}
        {...ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS}
      >
        <Input
          type="number"
          styles={{
            inputPrefix: '!border-0',
            containerDiv: '!py-3.5 !px-3 !bgi-[var(--base-2-variant6)]',
          }}
          prefix={<Icon name="ic_verification_code" className="w-7 h-7" />}
          placeholder={{
            i18nKey: 'bind_phone_number_verification_code_placeholder',
          }}
          maxLength={6}
          suffix={
            <OTPCountDown
              currentKey={OTPCountDownKeys.OTP_LOGIN}
              getMobileFn={getCurrentMobile}
              className="active:transition active:duration-300 active:scale-95 !bg-transparent shadow-[var(--box-shadow)]"
              showUnit={false}
              i18nKey="forgot_password_verification_code_sent_toast"
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
      >
        <Input
          type="text"
          styles={{
            inputPrefix: '!border-0',
            containerDiv: '!py-3.5 !px-3 !bgi-[var(--base-2-variant6)]',
          }}
          prefix={
            <div className="w-7 h-7 flex justify-center items-center rounded-full">
              <Icon name="ic_add" className="w-7 h-7" />
            </div>
          }
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
          //       overlayClassName="]"
          //       btnClassName="!p-0"
          //       color="var(--base-2-variant11)"
          //       iconName="ic_tips_2_fill_1"
          //     />
          //   </div>
          // }
        />
      </Form.Item>

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
export default OTPLoginForm;
