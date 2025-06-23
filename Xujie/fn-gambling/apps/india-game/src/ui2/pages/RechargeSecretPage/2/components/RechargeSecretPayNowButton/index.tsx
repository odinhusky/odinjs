import { useTranslation } from 'react-i18next';
import { useRechargeSecretPageAction } from '@mode2/action/rechargeSecretPageAction/useRechargeSecretPageAction';
import cx from '@commonUtils/cx';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import React from 'react';
import { handleRechargeSecretPagePayNowBtnClick } from '@mode2/action/actionTypes';

export const RechargeSecretPayNowButton = () => {
  const { t } = useTranslation();
  const { handleRechargeSecretPageClick } = useRechargeSecretPageAction();

  return (
    <div
      className={cx(
        'w-screen',
        MOBILE_BREAK_POINT_MAX_WIDTH,
        'fixed bottom-0',
        'px-4 pt-3 pb-5 z-20',
        'bgi-[var(--base-2-variant5)]'
      )}
    >
      <BasePrimaryBtn
        className={cx('!h-[46px] px-4 py-3 box-border', 'm-auto')}
        classNameText="text-xl font-medium"
        disabled={false}
        debounceTimer={500}
        onClick={() => {
          handleRechargeSecretPageClick({
            actionName: handleRechargeSecretPagePayNowBtnClick,
          });
        }}
        children={t('deposit_pay_button')}
      />
    </div>
  );
};

export default RechargeSecretPayNowButton;
