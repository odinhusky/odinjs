import { cx, useGivenTimeCountDown } from '@libs/commonUtils';
import { formatCountdownTime } from '@libs/mode2/utils';
import { useTaskCenterPageStore } from '@libs/mode2/zustand/page/TaskCenterPage/taskCenterPageStore';

export const TaskAchievementDashboardCountDown = () => {
  const vigorExpireTime = useTaskCenterPageStore(
    (state) => state.dashboardInfo.vigorExpireTime
  );

  const { remainSec } = useGivenTimeCountDown({
    targetDate: new Date(vigorExpireTime * 1000),
    onEnd: () => console.log('Count Down End'),
  });

  return (
    <span
      className={cx(
        'mr-3',
        'flex-1',
        'bgi-[red]',
        'bgi-text-[var(--base-2-variant1)]',
        'text-sm'
      )}
    >
      (Reset after {formatCountdownTime(remainSec ?? 0)})
    </span>
  );
};

export default TaskAchievementDashboardCountDown;
