import BaseModal from '@libs/components/Modal';
import useDepositJackpotWheelModalStore from '@libs/mode2/zustand/modal/DepositJackpotWheelModal';
import { useDepositJackpotWheelModalBase } from '@mode2/usecase/modal/useDepositJackpotWheelModalBase';
import DepositJackpotWheelModalTitle from './components/DepositJackpotWheelModalTitle';
import DepositJackpotWheelModalFooter from './components/DepositJackpotWheelModalFooter';
import DepositJackpotWheelModalSpinWheel from './components/DepositJackpotWheelModalSpinWheel';
import { cx } from '@libs/commonUtils';
import DepositJackpotWheelRewardModal from './modals/DepositJackpotWheelRewardModal';
import useRefreshDepositJackpotWheelInfoBase from '@mode2/usecase/modal/useRefreshDepositJackpotWheelInfoBase';

export const DepositJackpotWheelModal = () => {
  //  刷新資料與狀態使用
  useRefreshDepositJackpotWheelInfoBase();
  useDepositJackpotWheelModalBase();

  const isShowDepositJackpotWheelModal = useDepositJackpotWheelModalStore(
    (state) => state.isShowDepositJackpotWheelModal
  );

  return (
    <>
      {isShowDepositJackpotWheelModal ? (
        <BaseModal className="bgi-[var(--transparent-gray-90)]">
          <div className={cx('relative')}>
            <DepositJackpotWheelModalTitle />

            <DepositJackpotWheelModalSpinWheel />

            <DepositJackpotWheelModalFooter />
          </div>
        </BaseModal>
      ) : null}

      <DepositJackpotWheelRewardModal />
    </>
  );
};

export default DepositJackpotWheelModal;
