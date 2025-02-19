import cx from '@commonUtils/cx';
import { Icon } from '@components/Icon';
import {
  handleWalletPageOpenOnlineServiceActionClick,
  handleWalletPageRechargeTabCheckOrderDeatilClick,
} from '@mode2/action/walletPageAction/acitonType';
import useWalletPageBaseActions from '@mode2/action/walletPageAction/useWalletPageBaseActions';

export const WalletPageMobileHeader = () => {
  const iconClassName = 'h-7 w-7 cursor-pointer';
  const { handleWalletPageBaseClick } = useWalletPageBaseActions();
  return (
    <div
      className={cx(
        'w-full absolute top-1/2 -translate-y-1/2 pl-[40px]',
        'flex gap-2 justify-end items-center'
      )}
    >
      <Icon
        className={iconClassName}
        name={'ic_customer_service_1'}
        onClick={() => {
          handleWalletPageBaseClick({
            actionName: handleWalletPageOpenOnlineServiceActionClick,
          });
        }}
      />
      <Icon
        className={iconClassName}
        name={'ic_history'}
        onClick={() => {
          handleWalletPageBaseClick({
            actionName: handleWalletPageRechargeTabCheckOrderDeatilClick,
          });
        }}
      />
    </div>
  );
};

export default WalletPageMobileHeader;
