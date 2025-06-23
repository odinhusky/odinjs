import BaseModal from '@libs/components/Modal';
import { cx } from '@libs/commonUtils';
import { useTranslation } from 'react-i18next';
import React from 'react';
import useLeaveModalStore from '@libs/mode2/zustand/components/leaveModalStore';
import useLeaveModalActions from '@libs/mode2/action/leaveModalAction/useLeaveModalActions';
import { handleLeaveModalBtnClick } from '@libs/mode2/action/actionTypes/leaveModalActionType';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';

// TODO Ronan
// TODO i18n
const LeaveModal = () => {
  const { isShowleaveModal } = useLeaveModalStore();
  const { handleLeaveModalClick } = useLeaveModalActions();

  const { t } = useTranslation();

  return isShowleaveModal ? (
    <BaseModal className="px-8 !bgi-[var(--transparent-gray-90)]">
      <div className="p-8 box-border text-center rounded-xl w-[364px] border border-[var(--base-1-main)] bgi-[var(--base-2-variant9)]">
        <div className="text-xl font-medium bgi-text-[var(--grayscale-100)]">
          Leave this page?
        </div>
        <div className="text-base font-medium my-8 bgi-text-[var(--grayscale-100)]">
          You haven’t submitted your UTR yet. Leaving now may result in losing
          your filled information.
        </div>

        <div className="flex justify-between gap-4 h-[46px]">
          <BaseSecondaryBtn
            className={cx('h-full', 'text-base font-medium', 'flex-1')}
            onClick={() => {
              handleLeaveModalClick({
                actionName: handleLeaveModalBtnClick,
                payload: {
                  value: 0,
                  page: BasePagePathObj.FullOrderDetailPage,
                },
              });
            }}
          >
            {t('Leave anyway')}
          </BaseSecondaryBtn>

          <BasePrimaryBtn
            className={cx('h-full', 'text-base font-medium', 'flex-1')}
            onClick={() =>
              handleLeaveModalClick({
                actionName: handleLeaveModalBtnClick,
                payload: {
                  value: 1,
                  page: BasePagePathObj.FullOrderDetailPage,
                },
              })
            }
          >
            {t('Stay on page')}
          </BasePrimaryBtn>
        </div>
      </div>
    </BaseModal>
  ) : null;
};
export default LeaveModal;
