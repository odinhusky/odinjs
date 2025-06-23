import './index.scss';
import Form from '@mode2/components/Form';
import {
  handleChangePasswordConfirmPasswordInputValueChange,
  handleChangePasswordNewPasswordInputValueChange,
  handleChangePasswordPageCurrentPasswordInputValueChange,
  handleChangePasswordSaveBtnClick,
} from '@mode2/action/actionTypes';
import { useTranslation } from 'react-i18next';
import { useMode2ChangePasswordPageStore } from '@mode2/zustand/page/changePasswordPageStore';
import { useChangePasswordPageActions } from '@mode2/action/changePasswordPageAction/useChangePasswordPageActions';
import FormInput from './components/FormInput';
import ChangePasswordPageDesktopHeader from './components/ChangePasswordPageDesktopHeader';
import cx from '@commonUtils/cx';
import { FLEX_COL } from '@libs/constant/style';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import useMode2ChangePasswordPageBase from '@libs/mode2/usecase/page/changePasswordPage/useMode2ChangePasswordPageBase';

export interface FormValues {
  currentPassword: string;
  name: string;
}

export const ChangePasswordPage = () => {
  useMode2ChangePasswordPageBase();
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { handleChangePasswordPageClick, disabled } =
    useChangePasswordPageActions();
  const containerDiv = 'bgi-[var(--grayscale-30)] !p-2';
  const currentPasswordInputValue = useMode2ChangePasswordPageStore(
    (state) => state.currentPasswordInputValue
  );
  const newPasswordInputValue = useMode2ChangePasswordPageStore(
    (state) => state.newPasswordInputValue
  );
  const confirmPasswordInputValue = useMode2ChangePasswordPageStore(
    (state) => state.confirmPasswordInputValue
  );

  const onFinish = (data: {
    confirmPassword: string;
    currentPassword: string;
    newPassword: string;
  }) => {
    handleChangePasswordPageClick({
      actionName: handleChangePasswordSaveBtnClick,
      payload: {
        oldPassword: data.currentPassword ? data.currentPassword : '',
        newPassword: data.newPassword,
      },
    });
  };

  const onFinishFailed = () => {
    // console.log('Failed:', err);
  };

  return (
    <div
      className={cx(
        'max-w-[1200px]',
        'bgi-text-[var(--grayscale-100)]',
        FLEX_COL,
        'gap-5',
        'mx-auto my-0',
        'py-3 mobile:py-5 tablet:py-8'
      )}
    >
      <ChangePasswordPageDesktopHeader />
      <div className="flex flex-col tablet:bgi-[var(--grayscale-20)] bgi-transform rounded-lg	tablet:p-6 p-0">
        <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <div className={cx('inputs', FLEX_COL, 'gap-0', 'tablet:mt-0')}>
            <FormInput
              form={form}
              name={'currentPassword'}
              title={{
                i18nKey: 'account_change_password_input_title_current_password',
              }}
              value={currentPasswordInputValue}
              placeholder={{
                i18nKey:
                  'account_change_password_input_hint_fill_in_current_password',
              }}
              onChange={(e) => {
                handleChangePasswordPageClick({
                  actionName:
                    handleChangePasswordPageCurrentPasswordInputValueChange,
                  payload: { value: e },
                });
              }}
              containerDiv={containerDiv}
            />
            <FormInput
              form={form}
              name={'newPassword'}
              title={{
                i18nKey: 'account_change_password_input_title_new_password',
              }}
              value={newPasswordInputValue}
              placeholder={{
                i18nKey:
                  'account_change_password_input_hint_setting_the_new_password',
              }}
              onChange={(e) => {
                handleChangePasswordPageClick({
                  actionName: handleChangePasswordNewPasswordInputValueChange,
                  payload: { value: e },
                });
              }}
              containerDiv={containerDiv}
            />
            <FormInput
              form={form}
              name={'confirmPassword'}
              title={{
                i18nKey: 'account_change_password_input_hint_confirm_password',
              }}
              value={confirmPasswordInputValue}
              placeholder={{
                i18nKey: 'account_change_password_input_hint_confirm_password',
              }}
              onValidator={(_, value) => {
                if (!value) {
                  return Promise.reject(t('toast_field_cannot_be_empty'));
                }
                if (value.length < 4) {
                  return Promise.reject(t('toast_password_hint'));
                }
                if (value !== newPasswordInputValue) {
                  return Promise.reject(t('toast_confirm_password_not_match'));
                }
                return Promise.resolve();
              }}
              onChange={(e) => {
                handleChangePasswordPageClick({
                  actionName:
                    handleChangePasswordConfirmPasswordInputValueChange,
                  payload: { value: e },
                });
              }}
              containerDiv={containerDiv}
            />
          </div>

          {/* Save Button */}
          <BasePrimaryBtn
            type="submit"
            className={cx(
              'bg-shadow-[var(--inset-shadow)]',
              'font-semibold',
              'px-4 py-2'
            )}
            children={t('earn_money_earn_btn_save')}
            disabled={disabled}
            debounceTimer={500}
          />
        </Form>
      </div>
    </div>
  );
};
export default ChangePasswordPage;
