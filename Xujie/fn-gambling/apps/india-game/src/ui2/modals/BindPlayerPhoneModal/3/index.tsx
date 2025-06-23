import BasePrimaryBtn from '@components/BasePrimaryBtn';
import BaseModal from '@libs/components/Modal';
import Form from '@mode2/components/Form';
import { useTranslation } from 'react-i18next';
import Icon from '@components/Icon';
import { cx } from '@libs/commonUtils';
import Input from '@mode2/components/Input';
import OTPCountDown from '@components/OTPCountDown';
import useBindPlayerPhoneModalStore, {
  BindType,
} from '@mode2/zustand/modal/BindPlayerPhoneModal';
import handleGlobalClick from '@libs/mode2/action/handleGlobalClick';
import {
  OTPCountDownKeys,
  useOTPCountDownStore,
} from '@libs/mode2/zustand/components/OTPCountDownStore';
import useBindPlayerPhoneForm from '@/hooks/modals/useBindPlayerPhoneForm';
import { useUserState } from '@/usecase/useUserState';
import { useEffect } from 'react';

import {
  ANTD_FORM_VALIDATE_WHEN_SUBMIT_PROPS,
  ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS,
} from '@constant/options';
import { useMessageStore } from '@libs/mode2/zustand/components/messageStore';
import { hasBindPhoneModalVersionList } from '@libs/constant/versions';
import { BindPlayerPhoneTypes } from '../BindPlayerPhoneTypes';
import { FLEX_CENTER } from '@libs/constant/style';

// TODO i18n
export const BindPlayerPhoneModal = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  // Refresh mainInfo 以及 information
  const { refreshUserState } = useUserState();

  const getCurrentMobile = () => {
    const currentMobile = form.getFieldValue('phone');
    return currentMobile;
  };

  const isShowBindPlayerPhoneModal = useBindPlayerPhoneModalStore(
    (state) => state.isShowBindPlayerPhoneModal
  );

  const setShowBindPlayerPhoneModal = useBindPlayerPhoneModalStore(
    (state) => state.setShowBindPlayerPhoneModal
  );

  const onClose = () => {
    setShowBindPlayerPhoneModal(false);
  };

  const bindType = useBindPlayerPhoneModalStore((state) => state.bindType);

  const setBindType = useBindPlayerPhoneModalStore(
    (state) => state.setBindType
  );

  const isBindPhoneAndPassword = bindType === BindType.BIND_PHONE_AND_PASSWORD;

  // const isBindPhoneAndPassword = true;

  const onClickClose = () => {
    handleGlobalClick({
      target: 'handleBindPlayerPhoneModalCloseBtnClick',
      callback: () => {
        onClose();
      },
    });
  };

  const { validator, bindPlayerPhone } = useBindPlayerPhoneForm({
    onClose,
    onSuccess: () => {
      refreshUserState();
    },
  });

  const otpId = useOTPCountDownStore((state) => state.otpId);

  // 關閉 Modal 的時候恢復預設值 & 清除輸入框內容
  useEffect(() => {
    if (isShowBindPlayerPhoneModal === false) {
      setBindType(BindType.BIND_PHONE);
      form.resetFields();
    }
  }, [isShowBindPlayerPhoneModal]);

  const vVersion = import.meta.env['VITE_V_VERSION'];
  const versionCheck = hasBindPhoneModalVersionList.includes(vVersion);

  return isShowBindPlayerPhoneModal && versionCheck ? (
    <BaseModal className="!bgi-[var(--transparent-gray-90)]">
      <div
        className={cx(
          'w-[90%] max-w-[408px] p-4 box-border rounded-xl',
          'bgi-[var(--base-2-variant9)] border border-[var(--base-1-main)]'
        )}
      >
        <div
          className={cx(
            'pb-3 mb-8',
            'flex justify-between items-center',
            'border-b border-[var(--transparent-white-10)]'
          )}
        >
          <h4
            className={cx(
              'text-lg font-medium bgi-text-[var(--grayscale-100)]'
            )}
          >
            {/* {t('bind_phone_number_title')} */}
            {/* TODO i18n */}
            Bind Phone No.
          </h4>
          {/* 關閉按鈕 */}
          <button
            onClick={() => {
              onClickClose?.();
            }}
          >
            <Icon name="ic_close" className="w-6 h-6" />
          </button>
        </div>

        <Form<BindPlayerPhoneTypes & Record<string, unknown>>
          form={form}
          className={cx('bind-player-phone-form')}
          {...ANTD_FORM_VALIDATE_WHEN_SUBMIT_PROPS}
          onFinish={(values) => {
            bindPlayerPhone({
              phone: values.phone,
              otpCode: values.otpCode,
              password: values?.password,
              otpId,
            });
          }}
          onFinishFailed={(errorInfo) => {
            const message = errorInfo?.errorFields?.[0]?.errors?.[0] || '';
            if (message) useMessageStore.getState().info(message);
          }}
        >
          {/* 手機號碼 */}
          <Form.Item
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
              maxLength={11}
              styles={{
                input: 'input',
                inputPrefix: '!bgi-border-[var(----transparent-white-10)]',
                containerDiv: '!py-3.5 !px-3 !bgi-[var(--base-2-variant6)]',
              }}
              placeholder={{
                i18nKey: 'sign_up_sign_in_input_phone_placeholder',
              }}
              prefix={
                <div className="flex items-center">
                  <Icon name="ic_smartphone" className="w-7 h-7" />
                  <span className="bgi-text-[var(--transparent-white-70)]">
                    {t('common_area_code')}
                  </span>
                </div>
              }
            />
          </Form.Item>

          {/* 驗證碼 */}
          <Form.Item
            name="otpCode"
            rules={[
              {
                required: true,
                validator: (_, value) => validator.otpCode(value),
              },
            ]}
            {...ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS}
          >
            <Input
              type={'number'}
              maxLength={6}
              styles={{
                input: 'input !px-0',
                inputPrefix: '!border-0',
                containerDiv: '!py-3.5 !px-3 !bgi-[var(--base-2-variant6)]',
              }}
              placeholder={{
                i18nKey:
                  'profile_my_info_set_login_password_enter_verification_code_placeholder',
              }}
              prefix={
                <Icon
                  color="var(--grayscale-70)"
                  className="w-6 h-6"
                  name="ic_verification_code"
                />
              }
              suffix={
                <OTPCountDown
                  currentKey={
                    OTPCountDownKeys.BIND_PLAYER_PHONE_MODAL_COUNTDOWN
                  }
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
            />
          </Form.Item>

          {isBindPhoneAndPassword ? (
            <>
              {/* 密碼 */}
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    validator: (_, value) => validator.password(value),
                  },
                ]}
                {...ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS}
              >
                <Input
                  type="password"
                  maxLength={13}
                  styles={{
                    input: 'input',
                    inputPrefix: '!border-0',
                    containerDiv: '!py-4 !bgi-[var(--base-2-variant6)]',
                  }}
                  placeholder={{
                    // TODO I18N
                    i18nKey: 'Enter between 8 and 32 characters',
                  }}
                  prefix={<Icon className="w-6 h-6" name="ic_lock_1" />}
                />
              </Form.Item>

              {/* 確認密碼 */}
              <Form.Item
                name="confirmPassword"
                rules={[
                  ({ getFieldValue }) => ({
                    required: true,
                    validator: (_, value) =>
                      validator.confirmPassword(value, getFieldValue),
                  }),
                ]}
                {...ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS}
              >
                <Input
                  type="password"
                  maxLength={13}
                  styles={{
                    input: 'input',
                    inputPrefix: '!border-0',
                    containerDiv: '!py-4 !bgi-[var(--base-2-variant6)]',
                  }}
                  placeholder={{
                    i18nKey: 'Enter the modified password again',
                  }}
                  prefix={<Icon className="w-6 h-6" name="ic_lock_1" />}
                />
              </Form.Item>
            </>
          ) : null}

          <div className={cx()}>
            <span
              className={cx(
                'bgi-text-[var(--grayscale-100)]',
                'text-sm',
                'font-medium',
                'blocks'
              )}
            >
              {!isBindPhoneAndPassword
                ? t('bind_phone_number_note')
                : t('bind_phone_number_setting_login_password_note')}
            </span>

            <div className="mt-8 flex justify-center">
              <BasePrimaryBtn
                // disabled={isSubmitDisable}
                debounceTimer={500}
                type="submit"
                children={t('bind_phone_number_confirm_button')}
                className="w-40 !h-12 text-lg font-medium"
              />
            </div>
          </div>
        </Form>
      </div>
    </BaseModal>
  ) : null;
};

export default BindPlayerPhoneModal;
