import { useTranslation } from 'react-i18next';
import { useKycDataStore } from '@/zustand/kyc/useKycDataStore';
import { useUserVerifyState } from '@/usecase/useUserVerifyState';
import React from 'react';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import cx from '@commonUtils/cx';
import { FLEX_ITEMS_CENTER } from '@constant/style';
import { Icon } from '@components/Icon';

export const BankAccountInfo = () => {
  const { t } = useTranslation();
  const bankAccountInfo = useKycDataStore((state) => state.bankAccountInfo);

  const { checkIsBankFirstBind } = useUserVerifyState();

  // TODO i18n
  return (
    <div className="flex flex-col bgi-text-[var(--grayscale-100)] text-base font-medium gap-[6px]">
      <div className="flex justify-between items-start">
        <p>{t('Bank account')}</p>
        {checkIsBankFirstBind() ? (
          <div
            onClick={() => {
              // TODO nav To KYC
            }}
          >
            <p className="text-sm font-normal bgi-text-[var(--base-1-main)] cursor-pointer underline">
              {t('View Account')}
            </p>
          </div>
        ) : null}
      </div>

      {!checkIsBankFirstBind() ? (
        <div className="bgi-[var(--linear-4)] rounded-md text-sm px-2 py-3 flex justify-between gap-2">
          <p className={''}>{t(`Acc No. ${bankAccountInfo.bankCode}`)}</p>
          <p className={''}>{t(`IFSC: ${bankAccountInfo.ifsc}`)}</p>
        </div>
      ) : (
        <BaseSecondaryBtn
          className={cx(
            'w-auto h-auto',
            'font-medium text-base',
            'py-2',
            'bgi-[var(--base-2-variant6)]'
          )}
          classNameText={cx(FLEX_ITEMS_CENTER)}
          onClick={() => {
            // TODO nav To KYC
          }}
          children={
            <>
              <Icon className="h-5 w-5" name="ic_add" />
              <span className="bgi-text-[var(--base-1-main)] ml-2.5">
                {t('Add New Account')}
              </span>
            </>
          }
        />
      )}
    </div>
  );
};

export default BankAccountInfo;
