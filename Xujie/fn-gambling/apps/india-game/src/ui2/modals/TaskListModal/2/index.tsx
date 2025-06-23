import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { cx, useGivenTimeCountDown } from '@libs/commonUtils';
import BaseModal from '@libs/components/Modal';
import Checkbox from '@libs/mode2/components/Checkbox';
import { useTaskListModalStore } from '@libs/mode2/zustand/modal/TaskListModal/useTaskListModalStore';
import { CloseBtnUnit } from '@modals/BaseModalCloseButton';
import { useTranslation } from 'react-i18next';
import { useTaskListModalActions } from '@libs/mode2/action/model/TaskListModalAction/useTaskListModalActions';
import {
  handleTaskListModalBtnClickAction,
  handleTaskListModalCloseClickAction,
  handleTaskListModalNotShowTodayClick,
} from '@mode2/action/actionTypes';
import {
  EResourceLevel,
  formatCountdownTime,
  getImgUrl,
} from '@libs/mode2/utils';
import { useTaskListModalBase } from '@libs/mode2/usecase/modal/useTaskListModalBase';
import { AnnouncementType } from '@libs/mode2/@types/announcementType';
import TaskListUnit from '@components/TaskListUnit';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';
import { Skeleton } from 'antd';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import {
  ScreenOrientationType,
  useTemplateLayoutStore,
} from '@libs/mode2/zustand/template/templateLayoutStore';

const TaskListSkeleton = () => {
  return (
    <>
      {Array.from({ length: 3 }, (_, index) => {
        return (
          <div key={index} className={cx(FLEX_ITEMS_CENTER, 'mb-5 gap-4')}>
            <Skeleton.Avatar size={40} />
            <Skeleton
              paragraph={{ rows: 2, width: '60%' }}
              active
              title={false}
            />
          </div>
        );
      })}
    </>
  );
};

const TaskListContent = ({ type }: { type: AnnouncementType }) => {
  const taskList = useTaskListModalStore((state) => state.taskList);
  const isLoading = useTaskListModalStore((state) => state.isLoading);

  return (
    <div className={cx('max-h-[324px] overflow-y-auto')}>
      {isLoading ? (
        <TaskListSkeleton />
      ) : (
        taskList.map((item, index) => (
          <TaskListUnit
            type={type}
            item={{
              ...item,
              rewardAmount: item.vigor,
            }}
            key={index}
            isModal={true}
          />
        ))
      )}
    </div>
  );
};

export const TaskListModal = () => {
  useTaskListModalBase();

  const { t } = useTranslation();
  const { handleTaskListModalClick } = useTaskListModalActions();
  const isShowTaskListModal = useTaskListModalStore(
    (state) => state.isShowTaskListModal
  );
  const currentUniqueId = useTaskListModalStore(
    (state) => state.currentUniqueId
  );
  const isNotShowToday = useTaskListModalStore((state) => state.isNotShowToday);
  const vigorExpireTime = useTaskListModalStore(
    (state) => state.vigorExpireTime
  );
  const currentTaskListType = useTaskListModalStore(
    (state) => state.currentTaskListType
  );
  const screenOrientation = useTemplateLayoutStore(
    (state) => state.screenOrientation
  );

  const { remainSec } = useGivenTimeCountDown({
    targetDate: new Date(vigorExpireTime * 1000),
    onEnd: () => console.log('Happy New Year!'),
  });

  const listImgName =
    currentTaskListType === AnnouncementType.NEW_PLAYER_TASK
      ? 'popup_new_player_bonus'
      : 'popup_daily_mission';

  return isShowTaskListModal ? (
    <BaseModal
      className={cx('!bgi-[var(--transparent-gray-90)]', {
        '!justify-start pt-20':
          screenOrientation === ScreenOrientationType.Portrait,
      })}
    >
      <div className={cx('w-[80%] max-w-[384px] ')}>
        <div className="w-full flex justify-end items-end mb-4 ">
          <CloseBtnUnit
            customClass="!border-none w-9 h-9 !p-0 rounded-none"
            onClose={() => {
              handleTaskListModalClick({
                actionName: handleTaskListModalCloseClickAction,
                payload: { uniqueId: currentUniqueId },
              });
            }}
          />
        </div>

        {/* list */}
        <div
          className={cx(
            'p-4 box-border',
            'bgi-[var(--base-2-variant9)] rounded-xl',
            'bgi-border-[var(--base-1-variant1)]'
          )}
        >
          <div
            className={cx(
              'h-24 box-border mb-3 text-lg font-medium',
              'flex flex-col justify-center',
              'bgi-text-[var(--grayscale-100)] rounded-md'
            )}
          >
            <BaseCacheImg
              src={getImgUrl(EResourceLevel.POPUP_BANNER, listImgName)}
              imgName={listImgName}
            />
          </div>
          <TaskListContent type={currentTaskListType} />
        </div>

        {/* 列表外的底部說明 */}
        <div className={cx('flex flex-col items-center')}>
          <div className="my-5 flex flex-col items-center">
            {currentTaskListType === AnnouncementType.DAILY_TASK ? (
              <div className="mb-1.5 bgi-text-[var(--base-1-main)]">
                ({t('mission_popup_time')} {formatCountdownTime(remainSec ?? 0)}
                )
              </div>
            ) : null}
            <Checkbox
              checked={isNotShowToday}
              onChange={() =>
                handleTaskListModalClick({
                  actionName: handleTaskListModalNotShowTodayClick,
                  payload: { value: !isNotShowToday },
                })
              }
              label={t('home_popup_donot_show_again')}
              checkName={getImgUrl(EResourceLevel.ICONS, 'ic_check_box')}
              uncheckName={getImgUrl(
                EResourceLevel.ICONS,
                'ic_check_box_unchecked'
              )}
              iconClassName="w-4 h-4"
              textClassName="text-xs"
            />
          </div>
          <BasePrimaryBtn
            className="w-[196px] h-11"
            classNameText="text-lg font-medium"
            children={'View All Tasks'}
            onClick={() => {
              handleTaskListModalClick({
                actionName: handleTaskListModalBtnClickAction,
                payload: {
                  type: currentTaskListType,
                  uniqueId: currentUniqueId,
                },
              });
            }}
          />
        </div>
      </div>
    </BaseModal>
  ) : null;
};

export default TaskListModal;
