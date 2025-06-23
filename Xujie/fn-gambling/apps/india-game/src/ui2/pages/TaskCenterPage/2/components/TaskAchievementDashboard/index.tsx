import TaskAchievementDashboardHeader from './components/TaskAchievementDashboardHeader';
import { cx } from '@libs/commonUtils';
import BgPattern from '@components/BgPattern';
import TaskAchievementDashboardController from './components/TaskAchievementDashboardController';
import TaskAchievementDashboardContent from './components/TaskAchievementDashboardContent';
import { FLEX_COL } from '@libs/constant/style';

export const contaienrPaddingRightControl = cx('pr-6');

export const TaskAchievementDashboard = () => {
  return (
    <div
      className={cx(
        'w-full',
        'rounded',
        'pl-6 py-3 box-border',
        'relative',
        'bgi-[var(--base-2-variant14)]',
        'border bgi-border-[var(--transparent-white-20)]'
      )}
    >
      <BgPattern />

      <div className={cx('relative z-[2]', FLEX_COL, 'gap-3')}>
        <TaskAchievementDashboardHeader />

        <TaskAchievementDashboardContent />

        <TaskAchievementDashboardController />
      </div>
    </div>
  );
};

export default TaskAchievementDashboard;
