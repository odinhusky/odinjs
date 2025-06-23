import BaseModal from '@libs/components/Modal';
import useLeaveGameConfirmModalStore from '@mode2/zustand/components/leaveGameConfirmModalStore';
import { useLeaveGame } from '@mode2/usecase/useLeaveGame';
import Icon from '@components/Icon';
import { cx } from '@libs/commonUtils';
import { useTranslation } from 'react-i18next';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';

const LeaveGameConfirmModal = () => {
  const { isShowLeaveGameConfirmModal, setIsShowLeaveGameConfirmModal } =
    useLeaveGameConfirmModalStore();

  const { t } = useTranslation();
  const { handleConfirmLeave } = useLeaveGame();
  return isShowLeaveGameConfirmModal ? (
    <BaseModal className="!bgi-[var(--transparent-gray-90)]">
      <div className="rounded-xl  max-w-96 p-4 bgi-[var(--base-2-variant9)] border border-[var(--base-1-main)]">
        <div className="pb-3 border-b border-[var(--transparent-white-10)] flex items-center justify-between">
          <span className="text-lg font-medium bgi-text-[var(--grayscale-100)]">
            Reminder
          </span>
          <Icon
            className="w-6 h-6"
            name="ic_close"
            color="var(--base-1-main)"
            onClick={() => setIsShowLeaveGameConfirmModal(false)}
          />
        </div>
        <div className="text-sm my-8 bgi-text-[var(--grayscale-100)]">
          {t('game_popup_leave_content_to_sync_data')}
        </div>
        <div className="flex justify-between gap-4 h-12">
          <BaseSecondaryBtn
            className={cx(
              'h-full flex-1',
              // 'shadow-[0px_3px_1px_0px_#420107]',
              'bg-shadow-[var(--box-shadow-5)]'
            )}
            classNameText="text-lg font-medium"
            onClick={handleConfirmLeave}
            children={`${t('game_popup_leave_btn_exit_game')}`}
          />

          <BasePrimaryBtn
            className={cx(
              'h-full flex-1',
              // 'shadow-[0px_3px_1px_0px_#420107]',
              'bg-shadow-[var(--box-shadow-5)]'
            )}
            classNameText="text-lg font-medium"
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
