import BasePrimaryBtn from '@components/BasePrimaryBtn';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import Icon from '@components/Icon';
import { cx } from '@libs/commonUtils';
import BaseModal from '@libs/components/Modal';
import {
  handleTaskCenterPageTaskListItemGoToBtnClick,
  handleTaskCenterPageTaskListItemClaimBtnClick,
  handleTaskCenterPageModalCloseBtnClick,
} from '@mode2/action/actionTypes';
import useTaskCenterPageActions from '@libs/mode2/action/taskCenterPageAction/useTaskCenterPageActions';
import {
  MissionResult,
  MissionState,
} from '@libs/mode2/external/api/endpoint/mission/PostMissionOngoingEndpoint';
import { useTaskCenterPageStore } from '@libs/mode2/zustand/page/TaskCenterPage/taskCenterPageStore';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const TaskCenterModal = () => {
  const { t } = useTranslation();
  const { handleTaskCenterPageClick } = useTaskCenterPageActions();
  const showModal = useTaskCenterPageStore((state) => state.showModal);

  const [detail, setDetail] = useState({} as MissionResult);

  useEffect(() => {
    if (showModal && showModal.detail) {
      setDetail(JSON.parse(decodeURIComponent(showModal.detail)));
    }
  }, [showModal]);

  return showModal.show ? (
    <BaseModal className='bgi-[var(--transparent-gray-90)]'>
      <div
        className={cx(
          'w-[364px] relative',
          'p-4 pt-3 box-border',
          'bgi-text-[var(--grayscale-100)]',
          'border-2 border-[var(--base-1-main)] rounded-xl',
          'bgi-[var(--base-2-variant9)]'
        )}
      >
        <Icon
          name="ic_close"
          className={cx('absolute top-3 right-3', 'w-6 h-6 cursor-pointer')}
          onClick={() => {
            handleTaskCenterPageClick({
              actionName: handleTaskCenterPageModalCloseBtnClick,
            });
          }}
        />
        <div
          className={cx(
            'py-3 box-border',
            'text-lg font-medium text-center',
            'border-b border-[var(--transparent-white-10)]'
          )}
        >
          {detail?.title ? detail.title : t('mission_mission_title')}
        </div>
        <div className={cx('my-8')}>{detail.describe}</div>

        {detail.state === MissionState.CLAIMABLE ? (
          <BasePrimaryBtn
            className={cx('w-full h-12', 'text-lg font-medium', 'rounded-md')}
            onClick={() => {
              handleTaskCenterPageClick({
                actionName: handleTaskCenterPageTaskListItemClaimBtnClick,
                payload: {
                  id: detail.id,
                  claim: detail.rewardAmount,
                },
              });
            }}
          >
            {t('mission_claim_button')}
          </BasePrimaryBtn>
        ) : null}

        {detail.state === MissionState.INCOMPLETE ? (
          <BaseSecondaryBtn
            className={cx('w-full h-12', 'text-lg font-medium', 'rounded-md')}
            onClick={() => {
              handleTaskCenterPageClick({
                actionName: handleTaskCenterPageTaskListItemGoToBtnClick,
                payload: {
                  actionType: detail.actionType!,
                },
              });
            }}
          >
            {t('mission_go_button')}
          </BaseSecondaryBtn>
        ) : null}
      </div>
    </BaseModal>
  ) : null;
};

export default TaskCenterModal;
