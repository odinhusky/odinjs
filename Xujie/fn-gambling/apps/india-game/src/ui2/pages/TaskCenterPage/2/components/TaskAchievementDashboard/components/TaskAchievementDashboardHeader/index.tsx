import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { cx } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { contaienrPaddingRightControl } from '../..';
import { useTaskCenterPageStore } from '@libs/mode2/zustand/page/TaskCenterPage/taskCenterPageStore';
import useTaskCenterPageActions from '@libs/mode2/action/taskCenterPageAction/useTaskCenterPageActions';
import { handleTaskCenterPageBoxClaimAllBtnClick } from '@mode2/action/actionTypes';
import TaskAchievementDashboardCountDown from '../TaskAchievementDashboardCountDown';

export const TaskAchievementDashboardHeader = () => {
  const isAllClaimable = useTaskCenterPageStore(
    (state) => state.isAllClaimable
  );

  const { handleTaskCenterPageClick } = useTaskCenterPageActions();

  return (
    <div className={cx(FLEX_ITEMS_CENTER, contaienrPaddingRightControl)}>
      <TaskAchievementDashboardCountDown />

      <BasePrimaryBtn
        className={cx('w-[76px] h-[28px]', 'shadow-[var(--box-shadow)]')}
        children={'Claim all'}
        debounceTimer={200}
        disabled={!isAllClaimable}
        onClick={() => {
          handleTaskCenterPageClick({
            actionName: handleTaskCenterPageBoxClaimAllBtnClick,
          });
        }}
      />
    </div>
  );
};

export default TaskAchievementDashboardHeader;
