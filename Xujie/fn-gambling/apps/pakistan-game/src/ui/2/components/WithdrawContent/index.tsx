import './index.scss';
import React, { memo, useEffect, useMemo } from 'react';
import { notification, Progress, Select } from 'antd';
import Input from '@mode2/components/Input';
import {
  handleWalletPageWithdrawAmountInputValueChange,
  handleWalletPageWithdrawAmountInputValueClear,
  handleWalletPageWithdrawBankOptionsValueChange,
  handleWalletPageWithdrawBtnClick,
  handleWalletPageWithdrawPasswordInputValueChange,
} from '@/action/walletPageAction/acitonType';
import useWalletPageActions from '@/action/walletPageAction/useWalletPageActions';
import {
  EResourceLevel,
  formatMoney,
  formatNumber,
  getImgUrl,
} from '@mode2/utils';
import { useWalletPageWithdrawContentStore } from '@/zustand/page/walletPageStore';
import { WithdrawDescription } from '@pages/WalletPage/components/WithdrawDescription';
import { useTranslation } from 'react-i18next';
import { cx } from '@libs/commonUtils/cx';
import Form from '@mode2/components/Form';
import { WithdrawContentValidator } from '@/validator/antdValidator';
import { FLEX_CENTER, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { isEmpty, isNull } from 'lodash';
import { useDeepEffect } from '@libs/commonUtils';
import Icon from '@mode2/components/Icon';
import { FormInstance } from 'antd/es/form/hooks/useForm';
import { SavedBankListResult } from '@/external/api/endpoint/PostSavedBankListEndpoint';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { useWithdrawStore } from '@/zustand/wallet/useWithdrawStore';
import AffixBottomWrapper from '@mode2/components/AffixBottomWrapper';
import useWalletPageBaseActions from '@mode2/action/walletPageAction/useWalletPageBaseActions';
import {
  handleWalletPageWithdrawModifierClick,
  handleWalletPageWithdrawTabCheckOrderClick,
} from '@mode2/action/walletPageAction/acitonType';

interface BankOption extends SavedBankListResult {
  value: number;
  label: React.ReactNode;
}

const WithdrawInfoSummary = memo(() => {
  const { handleWalletPageBaseClick } = useWalletPageBaseActions();
  const { t } = useTranslation();

  const withdrawTotalBalance = useWithdrawStore(
    (state) => state.withdrawTotalBalance
  );
  const withdrawLockAssets = useWithdrawStore(
    (state) => state.withdrawLockAssets
  );

  const withdrawProgress = useWithdrawStore((state) => state.withdrawProgress);

  const blockClass =
    'bgi-[var(--grayscale-20)] tablet:bgi-[var(--grayscale-15)] p-3 mobile:py-3 mobile:px-6 tablet:p-6 rounded tablet:rounded-lg';
  const moneyTextClass = 'font-medium text-base mobile:text-xl tablet:text-3xl';
  const labelTextClass = 'font-medium text-base mobile:text-lg';

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
            <Icon className={'h-5 w-5 mr-1'} name="ic_rs" />
            <div className={moneyTextClass}>
              {formatNumber(withdrawTotalBalance, true)}
            </div>
          </div>
          <div className={labelTextClass}>
            {t('wallet_withdraw_money_total_balance')}
          </div>
        </div>
        <div className={cx(FLEX_ITEMS_CENTER, 'flex-col')}>
          <div className={cx(FLEX_ITEMS_CENTER)}>
            <Icon className={'h-5 w-5 mr-1'} name="ic_rs" />
            <div className={moneyTextClass}>
              {formatNumber(withdrawLockAssets, true)}
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
            <Icon
              className="w-5 h-5"
              name="ic_check_order"
              color="var(--state-warn-main)"
            />
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
});

const BankCardSelector = memo(() => {
  const { handleWalletPageClick } = useWalletPageActions();
  const withdrawBankCards = useWalletPageWithdrawContentStore(
    (state) => state.withdrawBankCards
  );
  const savedBankOptions: BankOption[] = useMemo(() => {
    return withdrawBankCards.map((item) => ({
      ...item,
      value: item.id,
      label: (
        <div className="form-select-option flex gap-1">
          <Icon
            name={`ic_${item.bankName?.toLowerCase() || ''}`}
            className="w-6 h-6"
          />
          <span className="form-select-option-text">{item.name}</span>
        </div>
      ),
    }));
  }, [withdrawBankCards]);
  return (
    <div>
      <Form.Item className={'mb-0'} name={'withdrawBankId'}>
        <Select<number, BankOption>
          className="form-select"
          onChange={(value, option) => {
            const card = option as SavedBankListResult;
            if (option) {
              handleWalletPageClick({
                actionName: handleWalletPageWithdrawBankOptionsValueChange,
                payload: { value: card },
              });
            }
          }}
          disabled={false}
          placeholder={''}
          options={savedBankOptions}
        />
      </Form.Item>
    </div>
  );
});

const BankCardInfo = memo(() => {
  const { handleWalletPageBaseClick } = useWalletPageBaseActions();
  const { t } = useTranslation();
  const withdrawBankValue = useWalletPageWithdrawContentStore(
    (state) => state.withdrawBankValue
  );
  return (
    <div className="flex flex-col gap-4">
      {/* bank account info */}
      <div className="flex flex-col gap-2 font-normal text-sm mobile:text-base">
        <div className={''}>
          {t('wallet_withdraw_bank_account_bank_account')}
        </div>

        <div className={'flex justify-between'}>
          {t('wallet_withdraw_bank_account_edit_or_add')}
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
      </div>

      {/* 分割線 */}
      <div className={cx('', 'h-px w-full bgi-[var(--grayscale-50)]')} />

      {/* bank card selector & card info*/}
      <div className={'flex flex-col gap-3'}>
        <div className={'flex flex-col gap-2'}>
          {t('wallet_withdraw_bank_account_payment_account')}
          <BankCardSelector />
        </div>

        <div
          className={
            'flex justify-between font-normal text-sm mobile:text-base'
          }
        >
          {/* TODO Evan i18n [PK] */}
          <span>{t('wallet_withdraw_bank_account_acc_no')}</span>
          <span>{withdrawBankValue?.bankCode}</span>
        </div>

        <div
          className={
            'flex justify-between font-normal text-sm mobile:text-base'
          }
        >
          <span>{t('wallet_withdraw_bank_account_unique_id_codes')}</span>
          <span>{withdrawBankValue?.cnic}</span>
        </div>
      </div>
    </div>
  );
});

const WithdrawAmountInput = memo(() => {
  const { handleWalletPageClick } = useWalletPageActions();
  const { t } = useTranslation();
  const withdrawLimitStr = useWalletPageWithdrawContentStore(
    (state) => state.withdrawLimitStr
  );
  const withdrawVipLevel = useWithdrawStore((state) => state.withdrawVipLevel);

  const dailyWithdrawLimit = useWithdrawStore(
    (state) => state.dailyWithdrawLimit
  );

  return (
    <div className={cx('h-auto flex flex-col gap-5 mobile:gap-3 tablet:gap-5')}>
      <div className="flex items-center gap-3">
        <img
          src={getImgUrl(EResourceLevel.V, `vip_level_${withdrawVipLevel}`)}
          alt="icon-vip"
          className="w-[72px] h-[60px]"
        />
        <p className="text-wrap">
          <span>
            {t('wallet_withdraw_daily_withdrawal_limit_daily_withdrawal_limit')}
            :
          </span>
          <span className="bgi-text-[var(--state-warn-main)]">
            {formatMoney(dailyWithdrawLimit, true)}
          </span>
        </p>
      </div>

      <div
        className={cx('flex flex-col gap-2', 'mt-5 mobile:mt-3 tablet:mt-5')}
      >
        <div className={cx('text-wrap')}>
          <div>
            {t('wallet_withdraw_daily_withdrawal_limit_single_withdrawal')}
          </div>
          <div>
            ({formatMoney(withdrawLimitStr[0])} -{' '}
            {formatMoney(withdrawLimitStr[1])})
          </div>
        </div>
        <Form.Item
          className={'mb-0'}
          name="withdrawAmount"
          labelCol={{ span: 24 }} // label 佔滿一整行
          rules={[
            {
              required: true,
              validator: (_, value) =>
                WithdrawContentValidator.amount(value, t, withdrawLimitStr[1]),
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleWalletPageClick({
                    actionName: handleWalletPageWithdrawAmountInputValueClear,
                  });
                }}
              >
                <Icon
                  className="w-full"
                  name="ic_close"
                  color="var(--grayscale-70)"
                />
              </div>
            }
          />
        </Form.Item>
      </div>
    </div>
  );
});

const WithdrawPasswordInput = memo(() => {
  const { handleWalletPageClick } = useWalletPageActions();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <div className={cx('')}>
        {t('wallet_withdraw_input_hint_withdrawal_password')}
      </div>

      <Form.Item
        className={'mb-0'}
        name="withdrawPassword"
        labelCol={{ span: 24 }} // label 佔滿一整行
        rules={[
          {
            required: true,
            message: t('toast_password_cannot_be_empty'),
            // validator: (_, value) =>  KYCValidator.password(value, t),
          },
        ]}
      >
        <Input
          type={'no_rules_password'}
          autoComplete="new-password"
          maxLength={13}
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
});

const WithdrawInputForm = memo((form: FormInstance) => {
  const { handleWalletPageClick } = useWalletPageActions();

  const BLOCK_CLASS_NAME =
    'bgi-[var(--grayscale-20)] tablet:bgi-[var(--grayscale-15)] rounded p-3 rounded p-3 mobile:px-6';
  return (
    <Form
      form={form}
      className={cx(
        'w-full h-auto',
        'tablet:rounded-lg',
        'grid grid-cols-1 tablet:grid-cols-2 tablet:grid-rows-2 ',
        'gap-4 tablet:gap-y-0 tablet:gap-x-6',
        'text-sm font-medium mobile:text-lg bgi-text-[var(--grayscale-100)]'
      )}
      onFinish={() => {
        handleWalletPageClick({
          actionName: handleWalletPageWithdrawBtnClick,
        });
      }}
      onFinishFailed={(errorInfo) => {
        const message = errorInfo?.errorFields?.[0]?.errors?.[0] || '';
        notification.error({
          message,
        });
      }}
    >
      <div className={cx(BLOCK_CLASS_NAME, 'tablet:pb-0')}>
        <WithdrawAmountInput />
      </div>

      <div className={cx(BLOCK_CLASS_NAME, 'tablet:pb-0 row-span-2')}>
        <BankCardInfo />
      </div>
      <div className={cx(BLOCK_CLASS_NAME, 'tablet:pt-5')}>
        <WithdrawPasswordInput />
      </div>
    </Form>
  );
});

export const WithdrawContent = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

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

  const withdrawBankValue = useWalletPageWithdrawContentStore(
    (state) => state.withdrawBankValue
  );
  const disabled = useWalletPageWithdrawContentStore((state) => state.disabled);

  const handleWithdrawInputReset = () => {
    setWithdrawAmountInputValue('');
    setWithdrawPasswordInputValue('');
    // setWithdrawBankValue(null);
    form.setFieldsValue({
      withdrawBankId: '',
      withdrawAmount: '',
      withdrawPassword: '',
    });
  };

  useDeepEffect(() => {
    form.setFieldsValue({
      withdrawBankId: withdrawBankValue?.id || null,
      withdrawAmount: withdrawAmountInputValue,
      withdrawPassword: withdrawPasswordInputValue,
    });
  }, [withdrawBankValue, withdrawAmountInputValue, withdrawPasswordInputValue]);

  useEffect(() => {
    setWithdrawAmountInputValue('');
    setWithdrawPasswordInputValue('');
    return () => {
      handleWithdrawInputReset();
    };
  }, []);

  return (
    <div
      className={cx(
        'p-0 tablet:p-6',
        'box-border',
        'rounded-lg',
        'tablet:bgi-[var(--grayscale-20)]'
      )}
    >
      <WithdrawInfoSummary />
      <WithdrawInputForm {...form} />
      {/* 提交按鈕 */}
      <div className={cx('mt-6')}>
        <AffixBottomWrapper
          hasBottomNav
          affixContainerClass="bgi-[var(--bg-main)] -mx-4 w-screen p-4"
        >
          <div>
            <BasePrimaryBtn
              className={cx(
                'h-10',
                'text-sm font-medium',
                'shadow-inner shadow-[inset_0_4px_4px_rgba(204,204,204,0.25),_inset_0_-4px_4px_rgba(51,51,51,0.25)]'
              )}
              disabled={
                isEmpty(withdrawPasswordInputValue) ||
                isEmpty(withdrawAmountInputValue) ||
                isNull(withdrawBankValue) ||
                disabled
              }
              debounceTimer={500}
              onClick={() => form.submit()}
              children={t('wallet_withdraw_btn_extract')}
            />
          </div>
        </AffixBottomWrapper>
      </div>
      <WithdrawDescription />
    </div>
  );
};

export default WithdrawContent;
