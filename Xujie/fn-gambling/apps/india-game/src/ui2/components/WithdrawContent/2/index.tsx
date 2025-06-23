import React, { MouseEvent, useEffect } from 'react';
import { notification, Progress } from 'antd';
import Input from '@mode2/components/Input';
import {
  handleWalletPageWithdrawAmountInputValueChange,
  handleWalletPageWithdrawAmountInputValueClear,
  handleWalletPageWithdrawBtnClick,
  handleWalletPageWithdrawPasswordInputValueChange,
} from '@mode2/action/actionTypes';
import useWalletPageActions from '@/action/walletPageAction/useWalletPageActions';
import { EResourceLevel, formatMoney, getImgUrl } from '@mode2/utils';
import { useWalletPageWithdrawContentStore } from '@/zustand/page/walletPageStore';
import { useKycDataStore } from '@/zustand/kyc/useKycDataStore';
import './index.scss';
import { Trans, useTranslation } from 'react-i18next';
import { cx } from '@libs/commonUtils/cx';
import Form from '@mode2/components/Form';
import { WithdrawContentValidator } from '@/validator/antdValidator';
import { FLEX_CENTER, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import isEmpty from 'lodash/isEmpty';
import { useDeepEffect } from '@libs/commonUtils';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { WithdrawNoteDescription } from '@components/WithdrawNoteDescription';
import { useWithdrawStore } from '@/zustand/wallet/useWithdrawStore';
import { useUserState } from '@/usecase/useUserState';
import Icon from '@components/Icon';
import AffixBottomWrapper from '@mode2/components/AffixBottomWrapper';
import useWalletPageBaseActions from '@mode2/action/walletPageAction/useWalletPageBaseActions';
import {
  handleWalletPageWithdrawModifierClick,
  handleWalletPageWithdrawTabCheckOrderClick,
} from '@mode2/action/actionTypes';

export const WithdrawContent = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  // Validator Instance
  const WithdrawContentValidatorInstance = WithdrawContentValidator(t);

  const { handleWalletPageClick } = useWalletPageActions();
  const { handleWalletPageBaseClick } = useWalletPageBaseActions();

  const withdrawLimitStr = useWalletPageWithdrawContentStore(
    (state) => state.withdrawLimitStr
  );
  const withdrawVipLevel = useWithdrawStore((state) => state.withdrawVipLevel);
  const withdrawTotalBalance = useWithdrawStore(
    (state) => state.withdrawTotalBalance
  );
  const withdrawLockAssets = useWithdrawStore(
    (state) => state.withdrawLockAssets
  );
  const dailyWithdrawLimit = useWithdrawStore(
    (state) => state.dailyWithdrawLimit
  );
  const withdrawProgress = useWithdrawStore((state) => state.withdrawProgress);

  const bankAccountInfo = useKycDataStore((state) => state.bankAccountInfo);

  const withdrawAmountInputValue = useWalletPageWithdrawContentStore(
    (state) => state.withdrawAmountInputValue
  );
  const setWithdrawAmountInputValue = useWalletPageWithdrawContentStore(
    (state) => state.setWithdrawAmountInputValue
  );

  const withdrawPasswordInputValue = useWalletPageWithdrawContentStore(
    (state) => state.withdrawPasswordInputValue
  );
  const setWithdrawPasswordInputValue = useWalletPageWithdrawContentStore(
    (state) => state.setWithdrawPasswordInputValue
  );
  const disabled = useWalletPageWithdrawContentStore((state) => state.disabled);
  const { refreshUserState } = useUserState();

  // lifecycle: Clear <input> values on enter & exit.
  const handleWithdrawInputReset = () => {
    setWithdrawAmountInputValue('');
    setWithdrawPasswordInputValue('');
    form.setFieldsValue({ withdrawAmount: '', withdrawPassword: '' });
  };

  useDeepEffect(() => {
    form.setFieldsValue({
      withdrawAmount: withdrawAmountInputValue,
      withdrawPassword: withdrawPasswordInputValue,
    });
  }, [withdrawAmountInputValue, withdrawPasswordInputValue]);

  useEffect(() => {
    handleWithdrawInputReset();
    refreshUserState();
    return () => {
      handleWithdrawInputReset();
    };
  }, []);

  const blockClass =
    'bgi-[var(--grayscale-20)] tablet:bgi-[var(--grayscale-15)] p-3 mobile:py-3 mobile:px-6 tablet:p-6 rounded tablet:rounded-lg';
  const labelTextClass = 'font-medium text-base mobile:text-lg';

  const handleWithdraw = () => {
    handleWalletPageClick({
      actionName: handleWalletPageWithdrawBtnClick,
      payload: {
        isPasswordless: false,
      },
    });
  };

  const handleAmountClear = (e: MouseEvent) => {
    e.stopPropagation();

    /**
     * 使用Form 的 setFieldValue 來確保畫面資料同步
     * 一般輸入時，Form 的值會自動更新是因為 Form.Item 提供的自動雙向綁定功能,但外部的直接狀態更新似乎不會觸發到
     */
    form.setFieldValue('withdrawAmount', '');
    handleWalletPageClick({
      actionName: handleWalletPageWithdrawAmountInputValueClear,
    });
  };

  const renderWithdrawInfoBlock = () => {
    const moneyTextClass =
      'font-medium text-base mobile:text-xl tablet:text-3xl';
    const moneyImgClass = 'h-5 w-5 mr-[4px]';

    return (
      <div className={cx(blockClass, 'mb-[24px]')}>
        <div className={cx(FLEX_CENTER)}>
          <div
            className={cx(
              'mr-[18px] mobile:mr-[12px] tablet:mr-[40px]',
              FLEX_ITEMS_CENTER,
              'flex-col'
            )}
          >
            <div className="flex items-center">
              <Icon className={moneyImgClass} name="ic_inr" />
              <div className={moneyTextClass}>
                {formatMoney({
                  value: withdrawTotalBalance,
                  includeDecimal: true,
                  showCurrency: false,
                })}
              </div>
            </div>
            <div className={labelTextClass}>
              {t('wallet_withdraw_money_total_balance')}
            </div>
          </div>
          <div className={cx(FLEX_ITEMS_CENTER, 'flex-col')}>
            <div className={cx(FLEX_ITEMS_CENTER)}>
              <Icon className={moneyImgClass} name="ic_inr" />
              <div className={moneyTextClass}>
                {formatMoney({
                  value: withdrawLockAssets,
                  includeDecimal: true,
                  showCurrency: false,
                })}
              </div>
            </div>
            <div className={labelTextClass}>
              {t('wallet_withdraw_money_lock_assets')}
            </div>
          </div>
        </div>

        <div className="mt-[20px] mobile:mt-[12px] taplet:mt-[20px]">
          <div className={cx(FLEX_ITEMS_CENTER, 'justify-between')}>
            <div className={labelTextClass}>
              {t('wallet_withdraw_money_withdrawable')}
            </div>
            <div className="flex items-center">
              <Icon className="w-5 h-5" name="ic_check_order" />
              <div
                className={cx(
                  'text-xs mobile:text-sm tablet:ml-1 font-medium underline cursor-pointer bgi-text-[var(--state-warn-main)] decoration-[#FE8B34]'
                )}
                onClick={() => {
                  handleWalletPageBaseClick({
                    actionName: handleWalletPageWithdrawTabCheckOrderClick,
                  });
                }}
              >
                {t('wallet_deposit_link_check_order')}
              </div>
            </div>
          </div>
          <Progress
            className="withdrawable-progress"
            percent={withdrawProgress}
            showInfo={false}
          />
        </div>
      </div>
    );
  };

  const renderBankInfoBlock = () => {
    const bankItemClass =
      'mb-[20px] flex justify-between text-base font-medium';

    return (
      <div className={cx(blockClass)}>
        <div className={bankItemClass}>
          <div className={labelTextClass}>
            {t('wallet_withdraw_bank_account_bank_account')}
          </div>
          <div
            className="value cursor-pointer bgi-text-[var(--state-success-main)] underline"
            onClick={() => {
              handleWalletPageBaseClick({
                actionName: handleWalletPageWithdrawModifierClick,
              });
            }}
          >
            {t('wallet_withdraw_bank_account_link_modifier')}
          </div>
        </div>
        <div className={bankItemClass}>
          <div className={labelTextClass}>
            {t('wallet_withdraw_bank_account_acc_no')}
          </div>
          <div className={labelTextClass}>{bankAccountInfo.bankCode}</div>
        </div>
        <div className={bankItemClass}>
          <div className={labelTextClass}>
            {t('wallet_withdraw_bank_account_unique_id_codes')}
          </div>
          <div className={labelTextClass}>{bankAccountInfo.ifsc}</div>
        </div>
      </div>
    );
  };

  const renderWithdrawAmountInputBlock = () => {
    const customBlockClass = 'tablet:p-0 mb-[20px] mobile:mb-[24px] tablet:m-0';
    const inputLabelClass =
      'mb-[8px] mobile:mb-[12px] tablet:mb-[8px] tablet:mt-[20px]';
    const textClass =
      'font-medium text-base mobile:text-lg bgi-text-[var(--grayscale-100)]';
    const [labelString1, labelString2] = t(
      'wallet_withdraw_daily_withdrawal_limit_single_withdrawal',
      {
        minLimit: formatMoney({ value: withdrawLimitStr[0] }),
        maxLimit: formatMoney({ value: withdrawLimitStr[1] }),
      }
    ).split('\n');

    return (
      <div className={cx(blockClass, customBlockClass)}>
        <div className="flex items-center">
          <img
            src={getImgUrl(EResourceLevel.V, `vip_level_${withdrawVipLevel}`)}
            alt="icon-vip"
            className="w-[72px] h-[60px] mr-[12px]"
          />
          <div className="mobile:flex mobile:flex-nowrap">
            <p className={cx(textClass, 'text-wrap')}>
              <Trans
                i18nKey="wallet_withdraw_daily_withdrawal_limit_daily_withdrawal_limit"
                values={{
                  dailyWithdrawLimit: formatMoney({
                    value: dailyWithdrawLimit,
                    includeDecimal: true,
                  }),
                }}
                components={{
                  dailyWithdrawLimitTag: (
                    <span className="bgi-text-[var(--state-warn-main)]" />
                  ),
                }}
              />
            </p>
          </div>
        </div>

        <div
          className={cx(
            'mobile:flex mobile:flex-nowrap',
            inputLabelClass,
            textClass,
            'mt-5 mobile:mt-3 tablet:mt-5'
          )}
        >
          <div>{labelString1}</div>
          <div>{labelString2}</div>
        </div>

        <Form.Item
          name="withdrawAmount"
          className="mb-0"
          labelCol={{ span: 24 }} // label 佔滿一整行
          rules={[
            {
              required: true,
              validator: (_, value) =>
                WithdrawContentValidatorInstance.amount(
                  value,
                  withdrawLimitStr[1]
                ),
            },
          ]}
        >
          <Input
            type={'number'}
            autoComplete="new-account"
            placeholder={{
              i18nKey:
                'wallet_withdraw_daily_withdrawal_limit_input_hint_enter_amount',
            }}
            onChange={(e) => {
              handleWalletPageClick({
                actionName: handleWalletPageWithdrawAmountInputValueChange,
                payload: { value: e },
              });
            }}
            suffix={
              <div
                className="w-6 h-6 mr-2 cursor-pointer"
                onClick={handleAmountClear}
              >
                <Icon className="w-full" name="ic_close_5" />
              </div>
            }
          />
        </Form.Item>
      </div>
    );
  };

  const renderPasswordInputBlock = () => {
    const customBlockClass = 'tablet:p-0';

    const inputLabelClass = 'mb-[8px] mobile:mb-3 tablet:mb-2 tablet:mt-5';
    const textClass =
      'font-medium text-base mobile:text-lg bgi-text-[var(--grayscale-100)]';

    return (
      <div className={cx(blockClass, customBlockClass)}>
        <div className={cx(inputLabelClass, textClass)}>
          {t('wallet_withdraw_input_hint_withdrawal_password')}
        </div>

        <Form.Item
          name="withdrawPassword"
          className="mb-0"
          labelCol={{ span: 24 }} // label 佔滿一整行
          rules={[
            {
              required: true,
              message: t('toast_password_cannot_be_empty'),
              // validator: (_, value) => KYCValidator.password(value, t),
            },
          ]}
        >
          <Input
            type={'no_rules_password'}
            autoComplete="new-password"
            // maxLength={13}
            placeholder={{
              i18nKey: 'wallet_withdraw_input_hint_withdrawal_password',
            }}
            onChange={(e) => {
              handleWalletPageClick({
                actionName: handleWalletPageWithdrawPasswordInputValueChange,
                payload: { password: e },
              });
            }}
          />
        </Form.Item>
      </div>
    );
  };

  const renderWithdrawInputBlock = () => {
    return (
      <div
        className={cx(
          'tablet:p-6',
          'tablet:rounded-lg',
          'tablet:bgi-[var(--grayscale-15)]',
          'tablet:box-border'
        )}
      >
        <Form
          form={form}
          onFinish={handleWithdraw}
          onFinishFailed={(errorInfo) => {
            const message = errorInfo?.errorFields?.[0]?.errors?.[0] || '';
            notification.error({
              message,
            });
          }}
        >
          {renderWithdrawAmountInputBlock()}
          {renderPasswordInputBlock()}
        </Form>
      </div>
    );
  };

  return (
    <div
      className={cx(
        'p-0 tablet:p-6',
        'box-border',
        'rounded-lg',
        'tablet:bgi-[var(--grayscale-20)]'
      )}
    >
      {renderWithdrawInfoBlock()}
      <div className="grid gap-6 tablet:grid-cols-2 grid-cols-1">
        {renderBankInfoBlock()}
        {renderWithdrawInputBlock()}
      </div>

      {/* 提交按鈕 */}
      <div className={cx('mt-6')}>
        <AffixBottomWrapper
          hasBottomNav
          offset={-3}
          affixContainerClass="bgi-[var(--bg-main)] -mx-4 w-screen p-4"
        >
          <div>
            <BasePrimaryBtn
              className={cx(
                'text-sm font-medium',
                'shadow-inner shadow-[inset_0_4px_4px_rgba(204,204,204,0.25),_inset_0_-4px_4px_rgba(51,51,51,0.25)]'
              )}
              disabled={
                isEmpty(withdrawPasswordInputValue) ||
                isEmpty(withdrawAmountInputValue) ||
                disabled
              }
              debounceTimer={500}
              onClick={() => form.submit()}
              children={t('wallet_withdraw_btn_extract')}
            />
          </div>
        </AffixBottomWrapper>
      </div>

      <WithdrawNoteDescription />
    </div>
  );
};

export default WithdrawContent;
