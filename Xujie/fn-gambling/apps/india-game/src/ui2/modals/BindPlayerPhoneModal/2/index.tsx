import BasePrimaryBtn from '@components/BasePrimaryBtn';
import BaseModal from '@libs/components/Modal';
import Form from '@mode2/components/Form';
import { notification } from 'antd';
import { useTranslation } from 'react-i18next';
import Icon from '@components/Icon';
import { cx } from '@libs/commonUtils';
import Input from '@mode2/components/Input';
import OTPCountDown from '@components/OTPCountDown';
import { FLEX_COL } from '@libs/constant/style';
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
import { hasBindPhoneModalVersionList } from '@libs/constant/versions';
import { BindPlayerPhoneTypes } from '../BindPlayerPhoneTypes';
import { CloseBtnUnit } from '@modals/BaseModalCloseButton';

export const BindPlayerPhoneModal = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const commonVerticalClass = cx(FLEX_COL, 'gap-4');

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

  // 關閉 Modal 的時候恢復預設值
  useEffect(() => {
    if (isShowBindPlayerPhoneModal === false) {
      setBindType(BindType.BIND_PHONE);
    }
  }, [isShowBindPlayerPhoneModal]);

  const vVersion = import.meta.env['VITE_V_VERSION'];
  const versionCheck = hasBindPhoneModalVersionList.includes(vVersion);

  return isShowBindPlayerPhoneModal && versionCheck ? (
    <BaseModal>
      <div
        className={cx(
          'w-[304px] phone:max-w-[400px] phone:w-full',
          'bgi-[var(--bg-main)]',
          'px-4 py-6',
          'relative',
          'border bgi-border-[var(--grayscale-50)]',
          'rounded-lg after-rounded-lg',
          commonVerticalClass
        )}
      >
        {/* 關閉按鈕 */}
        <CloseBtnUnit
          onClose={() => {
            onClickClose?.();
          }}
          customClass={cx('absolute top-3 right-3')}
        />

        <h4
          className={cx(
            'text-lg',
            'text-center',
            'block',
            import.meta.env['VITE_V_VERSION'] === 'v1'
              ? 'bgi-text-[var(--linear-4)]'
              : 'bgi-text-[var(--base-4-main)]'
          )}
        >
          {t('bind_phone_number_title')}
        </h4>

        <Form<BindPlayerPhoneTypes & Record<string, unknown>>
          form={form}
          className={cx('bind-player-phone-form')}
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
            notification.error({
              message,
            });
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
          >
            <Input
              type="number"
              maxLength={11}
              placeholder={{
                i18nKey: 'bind_phone_number_phone_number_placeholder',
              }}
              prefix={
                <div className="phone-prefix text-sm">
                  <span className="bgi-text-[var(--grayscale-70)]">+ 91</span>
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
          >
            <Input
              type={'number'}
              maxLength={6}
              placeholder={{
                i18nKey: 'bind_phone_number_verification_code_placeholder',
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
              >
                <Input
                  type="password"
                  maxLength={13}
                  placeholder={{
                    // TODO I18N
                    i18nKey: 'Setting login password',
                  }}
                  prefix={
                    <Icon
                      color="var(--grayscale-100)"
                      className="w-6 h-6"
                      name="ic_lock"
                    />
                  }
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
              >
                <Input
                  type="password"
                  maxLength={13}
                  placeholder={{
                    i18nKey:
                      'account_change_password_input_hint_confirm_password',
                  }}
                  prefix={
                    <Icon
                      color="var(--grayscale-70)"
                      className="w-6 h-6"
                      name="ic_verification_code"
                    />
                  }
                />
              </Form.Item>
            </>
          ) : null}

          <div className={cx(commonVerticalClass)}>
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

            <BasePrimaryBtn
              // disabled={isSubmitDisable}
              debounceTimer={500}
              type="submit"
              className={cx('text-xl', 'font-medium', 'py-2 px-4')}
              children={t('bind_phone_number_confirm_button')}
            />
          </div>
        </Form>
      </div>
    </BaseModal>
  ) : null;
};

export default BindPlayerPhoneModal;
