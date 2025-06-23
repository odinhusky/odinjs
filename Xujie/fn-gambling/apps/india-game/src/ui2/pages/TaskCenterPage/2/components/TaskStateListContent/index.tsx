import TaskListUnit from '@components/TaskListUnit';
import { cx } from '@libs/commonUtils';
import { MissionType } from '@libs/mode2/external/api/endpoint/mission/PostMissionOngoingEndpoint';
import { useTaskCenterPageStore } from '@mode2/zustand/page/TaskCenterPage/taskCenterPageStore';
import { AnnouncementType } from '@mode2/@types/announcementType';
import useTaskCenterPageActions from '@libs/mode2/action/taskCenterPageAction/useTaskCenterPageActions';
import {
  handleTaskCenterPageTaskListItemClaimBtnClick,
  handleTaskCenterPageTaskListItemGoToBtnClick,
  handleTaskCenterPageTaskListItemMoreBtnClick,
} from '@mode2/action/actionTypes';
import TaskCenterModal from '../../modal/TaskCenterModal';
import { Skeleton } from 'antd';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';

const TaskListSkeleton = () => {
  return (
    <div className="p-4 mr-10">
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
    </div>
  );
};

export const TaskStateListContent = () => {
  const { handleTaskCenterPageClick } = useTaskCenterPageActions();
  const misssionLoading = useTaskCenterPageStore(
    (state) => state.misssionLoading
  );
  const missionList = useTaskCenterPageStore((state) => state.missionList);
  const currentMissionType = useTaskCenterPageStore(
    (state) => state.currentMissionType
  );

  return (
    <div className={cx('max-h-[80%] overflow-y-auto')}>
      {misssionLoading ? (
        <TaskListSkeleton />
      ) : (
        missionList.map((item, index) => {
          return (
            <TaskListUnit
              type={
                currentMissionType === MissionType.NEW_PLAYER
                  ? AnnouncementType.NEW_PLAYER_TASK
                  : AnnouncementType.DAILY_TASK
              }
              item={item}
              key={index}
              onClaim={() => {
                handleTaskCenterPageClick({
                  actionName: handleTaskCenterPageTaskListItemClaimBtnClick,
                  payload: { id: item.id, claim: item.rewardAmount },
                });
              }}
              onGoTo={() => {
                handleTaskCenterPageClick({
                  actionName: handleTaskCenterPageTaskListItemGoToBtnClick,
                  payload: {
                    actionType: item.actionType,
                  },
                });
              }}
              onMore={() => {
                handleTaskCenterPageClick({
                  actionName: handleTaskCenterPageTaskListItemMoreBtnClick,
                  payload: {
                    id: item.id,
                    detail: item,
                  },
                });
              }}
            />
          );
        })
      )}

      <TaskCenterModal />
    </div>
  );
};

export default TaskStateListContent;
