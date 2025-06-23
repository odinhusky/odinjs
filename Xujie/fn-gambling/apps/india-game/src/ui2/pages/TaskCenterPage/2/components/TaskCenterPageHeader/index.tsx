import cx from '@commonUtils/cx';
import { Icon } from '@components/Icon';
import useTaskCenterPageActions from '@mode2/action/taskCenterPageAction/useTaskCenterPageActions';
import { handleTaskCenterPageHistoryBtnClick } from '@mode2/action/actionTypes';

export const TaskCenterPageHeader = () => {
  const { handleTaskCenterPageClick } = useTaskCenterPageActions();
  return (
    <div
      className={cx(
        'w-full absolute top-1/2 -translate-y-1/2 pl-[40px]',
        'flex justify-between items-center'
      )}
    >
      <div className="flex w-full justify-end items-end gap-4 ">
        <Icon
          className={cx('h-7 w-7 cursor-pointer')}
          name={'ic_team_data'}
          onClick={() =>
            handleTaskCenterPageClick({
              actionName: handleTaskCenterPageHistoryBtnClick,
            })
          }
        />
      </div>
    </div>
  );
};

export default TaskCenterPageHeader;
