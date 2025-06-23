import { cx } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import TaskAchievementDashboardVigorTotal from '../TaskAchievementDashboardVigorTotal';
import TaskAchievementDashboardMileStoneProgress from '../TaskAchievementDashboardMileStoneProgress';

export const TaskAchievementDashboardContent = () => {
  return (
    <div className={cx('w-full', FLEX_ITEMS_CENTER, 'gap-[18px]')}>
      <TaskAchievementDashboardVigorTotal />

      <TaskAchievementDashboardMileStoneProgress />
    </div>
  );
};

export default TaskAchievementDashboardContent;
