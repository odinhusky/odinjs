import { useTranslation } from 'react-i18next';
import Form from '@mode2/components/Form';
import { RegisterPayload } from '@mode2API/endpoint/user/PostRegisterEndpoint';
import { notification } from 'antd';
import Input from '@mode2/components/Input';
import { Icon } from '@components/Icon';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import cx from '@commonUtils/cx';
import useInvitedRegister from '../../useInvitedRegister';

export const InvitedToRegisterContent = () => {
  const { t } = useTranslation();
  const { form, validator, register } = useInvitedRegister();
  return (
    <Form<RegisterPayload & Record<string, unknown>>
      form={form}
      className="login-form py-2.5 px-[54px]"
      onFinish={(values) => {
        register({ ...values });
        console.log('@@@===>Form.values', JSON.stringify(values, null, 2));
      }}
      onFinishFailed={(errorInfo) => {
        const message = errorInfo?.errorFields?.[0]?.errors?.[0] || '';
        notification.error({
          message,
        });
      }}
      // initialValues={}
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
            containerDiv:
              '!py-3.5 !px-4 !bgi-[var(--base-2-variant11)] !bgi-border-[var(--base-1-variant1)] !rounded-full',
          }}
          placeholder={{ i18nKey: 'Please enter your phone number' }} // TODO i18n
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

      <div className="text-sm font-medium bgi-text-[var(--grayscale-100)] my-2">
        {t(
          'Fill in your real phone number to win a free at the prize wheel! More exciting activities await after you log in.'
        )}
      </div>

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
            containerDiv:
              '!py-3.5 !px-4 !bgi-[var(--base-2-variant11)] !bgi-border-[var(--base-1-variant1)] !rounded-full',
          }}
          prefix={
            <div className="w-7 h-7 flex justify-center items-center rounded-full">
              <Icon name="ic_add" className="w-7 h-7" />
            </div>
          }
          placeholder={{ i18nKey: 'Please enter the referral code' }} // TODO i18n
          maxLength={10}
        />
      </Form.Item>

      <BasePrimaryBtn
        type="submit"
        className={cx(
          'text-lg',
          'font-medium',
          'h-14 px-4',
          'mt-6',
          'w-1/2 m-auto'
        )}
        children={<div>{'Pay now!'}</div>}
      />
    </Form>
  );
};

export default InvitedToRegisterContent
