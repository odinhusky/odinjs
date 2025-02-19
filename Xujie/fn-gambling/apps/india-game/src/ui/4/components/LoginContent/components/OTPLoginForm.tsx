import { useTranslation } from 'react-i18next';
import useLoginForm, { ILoginModalProps } from '@/hooks/modals/useLoginForm';
import Form from '@mode2/components/Form';
import Input from '@mode2/components/Input';
import { LoginPayload } from '@mode2API/endpoint/user/PostLoginEndpoint';
import { notification } from 'antd';
import { useIsShowLoginModalStore } from '@mode2/zustand/loginStore';
import Icon from '@components/Icon';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { cx, useDeepEffect } from '@libs/commonUtils';
import OTPCountDown from '@libs/components/OTPCountDown';
import { OTPCountDownKeys } from '@libs/mode2/zustand/components/OTPCountDownStore';
import QuestionTooltip from '@components/QuestionTooltip';

// TODO i18n
const OTPLoginForm = (props: ILoginModalProps) => {
  const { form, optLogin, isSubmitDisable, validator } = useLoginForm(props);

  const { t } = useTranslation();

  const referralCode = useIsShowLoginModalStore((state) => state.referralCode);

  useDeepEffect(() => {
    form.setFieldsValue({
      referralCode: referralCode,
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
      onFinish={optLogin}
      onFinishFailed={(errorInfo) => {
        const message = errorInfo?.errorFields?.[0]?.errors?.[0] || '';
        notification.error({
          message,
        });
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
            validator: (_, value) => validator.phone(value),
          },
        ]}
      >
        <Input
          type="number"
          maxLength={11}
          styles={{
            containerDiv: '!py-4 !bgi-[var(--base-2-variant6)]',
          }}
          placeholder={{
            i18nKey: 'sign_up_input_hint_enter_your_mobile_phone',
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
            message: t('bind_phone_number_verification_code_placeholder'),
            validator: (_, value) => validator.verifyCode(value),
          },
        ]}
      >
        <Input
          styles={{
            containerDiv: '!py-3.5 !bgi-[var(--base-2-variant6)]',
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
              className="bgi-[var(--base-2-variant5)] rounded-md"
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
            containerDiv: '!py-3.5 !bgi-[var(--base-2-variant6)]',
          }}
          prefix={
            <div className="w-7 h-7 flex justify-center items-center rounded-full">
              <Icon name="ic_add" className="w-7 h-7" />
            </div>
          }
          placeholder={{ i18nKey: 'login_referral_code_optional' }}
          maxLength={10}
          suffix={
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <QuestionTooltip
                placement="bottomRight"
                title={t('login_referral_code_reward_tips')}
                iconClassName="w-6 h-6"
                overlayClassName="]"
                btnClassName="!p-0"
                color="var(--base-2-variant11)"
                iconName="ic_tips_2_fill_1"
              />
            </div>
          }
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
