import BaseModal from '@libs/components/Modal';
import useLeaveGameConfirmModalStore from '@mode2/zustand/components/leaveGameConfirmModalStore';
import { useLeaveGame } from '@mode2/usecase/useLeaveGame';
import Icon from '@libs/mode2/components/Icon';
import { cx } from '@libs/commonUtils';
import { useTranslation } from 'react-i18next';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import BasePrimaryOutlineBtn from '@components/BasePrimaryOutlineBtn';

const LeaveGameConfirmModal = () => {
  const { isShowLeaveGameConfirmModal, setIsShowLeaveGameConfirmModal } =
    useLeaveGameConfirmModalStore();

  const { t } = useTranslation();
  const { handleConfirmLeave } = useLeaveGame();
  return isShowLeaveGameConfirmModal ? (
    <BaseModal className="px-8">
      <div className="bgi-[var(--grayscale-00)] text-center rounded-lg  max-w-[300px] mobile:w-96 p-3 mobile:p-4">
        <div className="flex items-center justify-center gap-2">
          <Icon
            className="w-6 h-6 mobile:w-8 mobile:h-8"
            name="ic_home"
            color="var(--base-1-main)"
          />
          <span className="bgi-text-[var(--base-1-main)] text-lg mobile:text-xl font-semibold">
            {t('game_popup_leave_title_notice')}
          </span>
        </div>
        <div className="bgi-text-[var(--grayscale-50)] mt-2 text-sm mobile:text-base font-medium">
          {t('game_popup_leave_content_to_sync_data')}
        </div>
        <div className="grid grid-cols-2 justify-between gap-4 h-8 mobile:h-10 text-base mobile:text-lg mt-3">
          <BasePrimaryOutlineBtn
            className={cx(
              'group',
              'h-full rounded-lg',
              'flex-1 bgi-[var(--grayscale-00)] bgi-border-[var(--base-1-main)] after:top-0',
            )}
            classNameBg="bgi-[#00000000]"
            classNameText={'!bgi-text-[var(--base-1-main)] group-hover:!bgi-text-[var(--grayscale-00)] group-active:!bgi-text-[var(--grayscale-00)]'}
            onClick={handleConfirmLeave}
            children={`${t('game_popup_leave_btn_exit_game')}`}
          />

          <BasePrimaryBtn
            className={cx('h-full', 'flex-1 rounded-lg')}
            classNameText={'!bgi-text-[var(--grayscale-00)]'}
            onClick={() => setIsShowLeaveGameConfirmModal(false)}
            children={t('game_popup_leave_btn_continue')}
          />
        </div>
      </div>
    </BaseModal>
  ) : (
    <></>
  );
};
export default LeaveGameConfirmModal;
