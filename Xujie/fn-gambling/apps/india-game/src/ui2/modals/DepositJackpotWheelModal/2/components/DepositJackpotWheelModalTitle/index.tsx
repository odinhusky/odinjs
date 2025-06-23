import { cx } from '@libs/commonUtils';
import {
  handleDepositJackpotWheelModalCloseClick,
  handleDepositJackpotWheelModalMaskClick,
} from '@libs/mode2/action/actionTypes';
import { useDepositJackpotWheelModalActions } from '@libs/mode2/action/model/DepositJackpotWheelModalAction/useDepositJackpotWheelModalAction';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';
import { getImgUrl, EResourceLevel } from '@libs/mode2/utils';
import { CloseBtnUnit } from '@modals/BaseModalCloseButton';

export const DepositJackpotWheelModalTitle = () => {
  const { handleDepositJackpotWheelModalClick } =
    useDepositJackpotWheelModalActions();

  return (
    // 輪盤高436 - 412 = 24px
    <div
      className={cx('relative', '-mb-6')}
      onClick={() => {
        handleDepositJackpotWheelModalClick({
          actionName: handleDepositJackpotWheelModalMaskClick,
        });
      }}
    >
      <BaseCacheImg
        src={getImgUrl(
          EResourceLevel.POPUP_BANNER,
          'popup_deposit_wheel_title'
        )}
        className="w-full"
      />
      <div className="absolute right-[22px] bottom-[18px]">
        <CloseBtnUnit
          customClass="!border-none w-9 h-9 !p-0 rounded-none"
          onClose={() => {
            handleDepositJackpotWheelModalClick({
              actionName: handleDepositJackpotWheelModalCloseClick,
            });
          }}
        />
      </div>
    </div>
  );
};

export default DepositJackpotWheelModalTitle;
