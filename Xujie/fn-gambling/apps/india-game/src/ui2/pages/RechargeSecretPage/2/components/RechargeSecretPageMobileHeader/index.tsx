import cx from '@commonUtils/cx';
import { Icon } from '@components/Icon';
import { handleRechargeSecretPageOpenOnlineServiceActionClick } from '@mode2/action/actionTypes';
import React from 'react';
import { useRechargeSecretPageAction } from '@mode2/action/rechargeSecretPageAction/useRechargeSecretPageAction';

export const RechargeSecretPageMobileHeader = () => {
  const iconClassName = 'h-7 w-7 cursor-pointer';
  const { handleRechargeSecretPageClick } = useRechargeSecretPageAction();
  return (
    <div
      className={cx(
        'w-full absolute top-1/2 -translate-y-1/2 pl-[40px]',
        'flex gap-4 justify-end items-center'
      )}
    >
      <Icon
        className={iconClassName}
        name={'ic_customer_service_1'}
        onClick={() => {
          handleRechargeSecretPageClick({
            actionName: handleRechargeSecretPageOpenOnlineServiceActionClick,
          });
        }}
      />
    </div>
  );
};

export default RechargeSecretPageMobileHeader;
