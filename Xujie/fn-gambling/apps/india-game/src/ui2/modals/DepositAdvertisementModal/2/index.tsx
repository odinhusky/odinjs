import BaseModal from '@libs/components/Modal';
import 'swiper/css';
import 'swiper/css/pagination';

import { cx } from '@libs/commonUtils';
import Icon from '@components/Icon';
import useDepositAdModalBase from '@libs/mode2/usecase/useDepositAdModalBase';
import useDepositAdModalAction from '@libs/mode2/action/depositAdModalAction/useDepositAdModalAction';
import {
  handleDepositAdModalClose,
  handleDepositAdModalToWalletClick,
} from '@mode2/action/actionTypes';
import {
  EResourceLevel,
  formatCountdownTime,
  getImgUrl,
} from '@libs/mode2/utils';
export const DepositAdvertisementModal = () => {
  const { isShowDepositAdvertisementModal, countDownTime } =
    useDepositAdModalBase();

  const { handleDepositAdModalClick } = useDepositAdModalAction();
  return isShowDepositAdvertisementModal ? (
    <BaseModal>
      <div className="relative  rounded-lg px-6 py-8  w-[356px]">
        <div
          className={cx(
            'absolute right-2 top-2 mobile:right-2 mobile:top-2 p-1 border border-[var(--transparent-white-70)] rounded-full cursor-pointer'
          )}
        >
          <Icon
            className="w-4 h-4"
            name="ic_close"
            color="var(--transparent-white-70)"
            onClick={() =>
              handleDepositAdModalClick({
                actionName: handleDepositAdModalClose,
              })
            }
          />
        </div>
        <div className="relative w-full">
          <div className="absolute right-[16%] top-[3%] text-2xl">
            {formatCountdownTime(countDownTime)}
          </div>
          <img
            className="cursor-pointer w-full"
            src={getImgUrl(
              EResourceLevel.POPUP_BANNER,
              'deposit_advertisement'
            )}
            alt="deposit_advertisement"
            onClick={() => {
              handleDepositAdModalClick({
                actionName: handleDepositAdModalToWalletClick,
              });
            }}
          />
        </div>
      </div>
    </BaseModal>
  ) : null;
};
export default DepositAdvertisementModal;
