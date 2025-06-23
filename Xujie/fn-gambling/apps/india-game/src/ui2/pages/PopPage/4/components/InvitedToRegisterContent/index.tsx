import { useTranslation } from 'react-i18next';
import Form from '@mode2/components/Form';
import { RegisterPayload } from '@mode2API/endpoint/user/PostRegisterEndpoint';
import Input from '@mode2/components/Input';
import { Icon } from '@components/Icon';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import cx from '@commonUtils/cx';
import useInvitedRegister from '../../useInvitedRegister';
import { ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS } from '@constant/options';
import { useMessageStore } from '@mode2/zustand/components/messageStore';
import usePopPageStore from '@libs/mode2/zustand/page/PopPage';

export const InvitedToRegisterContent = () => {
  const { t } = useTranslation();
  const { form, validator, register } = useInvitedRegister();
  const error = useMessageStore((state) => state.error);

  const hasToken = usePopPageStore((state) => state.hasToken);

  const isDisabledInputAndButton = hasToken;

  return (
    <Form<RegisterPayload & Record<string, unknown>>
      form={form}
      className="login-form py-2.5 px-[54px]"
      onFinish={(values) => {
        register({ ...values });
      }}
      onFinishFailed={(errorInfo) => {
        const message = errorInfo?.errorFields?.[0]?.errors?.[0] || '';
        error(message);
      }}
      // initialValues={}
    >
      <Form.Item
        className={'mb-1'}
        name="phone"
        rules={[
          {
            required: true,
            validator: (_, value) => validator.phone(value),
          },
        ]}
        {...ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS}
      >
        <Input
          type="number"
          disabled={isDisabledInputAndButton}
          maxLength={11}
          styles={{
            input: 'input-placeholder', // placeholder的字体
            inputPrefix: '!border-[var(--transparent-white-10)]',
            containerDiv:
              '!py-2.5 !px-4 !bgi-[var(--base-2-variant11)] !bgi-border-[var(--base-1-variant1)] !rounded-full',
            // inputPrefix:
            //   '!border-r-[0px] !bgi-border-r-[var(--base-2-variant2)]',
          }}
          placeholder={{ i18nKey: 'pop_page_phone_input_placeholder' }}
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

      <div className="text-sm font-medium bgi-text-[var(--grayscale-100)] mt-1.5 mb-5">
        {t('pop_page_phone_input_tip')}
      </div>

      <Form.Item
        className={'mb-1'}
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
          disabled={isDisabledInputAndButton}
          styles={{
            input: 'input-placeholder', // placeholder的字体
            containerDiv:
              '!py-2.5 !px-4 !bgi-[var(--base-2-variant11)] !bgi-border-[var(--base-1-variant1)] !rounded-full',
            inputPrefix: '!border-r-[0px]',
          }}
          prefix={<Icon name="ic_add" className="w-7 h-7" />}
          placeholder={{ i18nKey: 'pop_page_referral_input_placeholder' }}
          maxLength={10}
        />
      </Form.Item>

      <BasePrimaryBtn
        type="submit"
        disabled={isDisabledInputAndButton}
        className={cx(
          'w-[264px] h-[46px]',
          'text-xl font-medium',
          'm-auto mt-5'
        )}
        children={<div>{'Play now!!'}</div>}
      />
    </Form>
  );
};

export default InvitedToRegisterContent;
