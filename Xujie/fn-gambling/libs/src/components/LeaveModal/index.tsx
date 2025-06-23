import BaseModal from '@libs/components/Modal';
import { cx } from '@libs/commonUtils';
import { useTranslation } from 'react-i18next';
import React from 'react';
import useLeaveModalStore from '@libs/mode2/zustand/components/leaveModalStore';
import renderI18N from '@libs/commonUtils/renderI18N';
import useLeaveModalActions from '@libs/mode2/action/leaveModalAction/useLeaveModalActions';
import { handleLeaveModalBtnClick } from '@mode2/action/actionTypes';
import BaseIcon from '@mode2/components/BaseIcon';

export interface LeaveModalProps {
  content: string;
  exitText: string;
  page: string;
}

const LeaveModal = (props: LeaveModalProps) => {
  const { isShowleaveModal } = useLeaveModalStore();
  const { handleLeaveModalClick } = useLeaveModalActions();

  const { t } = useTranslation();

  return isShowleaveModal ? (
    <BaseModal className="px-8">
      <div className="bg-[var(--grayscale-100)] text-center rounded-lg  max-w-96 mobile:w-96 p-4 mobile:p-6">
        <div className="flex items-center justify-center gap-2">
          <BaseIcon
            className="w-6 h-6 mobile:w-8 mobile:h-8"
            name="ic_home"
            color="var(--base-1-main)"
          />
          <span className="bgi-text-[var(--base-1-main)] text-lg mobile:text-xl font-semibold">
            {renderI18N({ i18nKey: 'game_popup_leave_title_notice' }, t)}
          </span>
        </div>
        <div className="bgi-text-[var(--grayscale-50)] mt-2 text-sm mobile:text-base font-medium">
          {props.content}
        </div>
        <div className="flex justify-between gap-4 h-8 mobile:h-10 text-base mobile:text-lg mt-6">
          <button
            className={cx(
              'h-full',
              'text-base font-medium',
              'flex-1',
              'bgi-text-[var(--base-1-main)] rounded-full',
              'bgi-border-[var(--base-1-main)]'
            )}
            onClick={() => {
              handleLeaveModalClick({
                actionName: handleLeaveModalBtnClick,
                payload: { value: 0, page: props.page },
              });
            }}
          >
            {renderI18N({ i18nKey: props.exitText }, t)}
          </button>

          <button
            className={cx(
              'h-full',
              'text-base font-medium',
              'flex-1',
              'bgi-[var(--base-1-main)] rounded-full'
            )}
            onClick={() =>
              handleLeaveModalClick({
                actionName: handleLeaveModalBtnClick,
                payload: { value: 1, page: props.page },
              })
            }
          >
            {renderI18N({ i18nKey: 'game_popup_leave_btn_continue' }, t)}
          </button>
        </div>
      </div>
    </BaseModal>
  ) : (
    <></>
  );
};
export default LeaveModal;
