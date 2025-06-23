import Icon from '@components/Icon';
import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_COL } from '@libs/constant/style';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { useTaskCenterPageStore } from '@libs/mode2/zustand/page/TaskCenterPage/taskCenterPageStore';

export const TaskAchievementDashboardVigorTotal = () => {
  const vigorTotal = useTaskCenterPageStore(
    (state) => state.dashboardInfo.vigor
  );

  return (
    <div className={cx(FLEX_COL, 'gap-[6px]', 'w-20', '')}>
      <BaseCacheImg
        className="w-full"
        src={getImgUrl(EResourceLevel.V, 'activity_bonus_total')}
        imgName="activity_bonus_total"
        alt="activity_center_icon"
      />

      <div
        className={cx(
          'w-full h-7',
          'px-2.5 box-border',
          'rounded',
          'border border-[var(--transparent-white-20)]',
          'bgi-[var(--transparent-gray-30)]',
          'flex items-center justify-start rounded-full'
        )}
      >
        <Icon name="ic_task" className={cx('w-5 h-5')} />

        <span
          className={cx(
            'max-w-[40px]',
            'bgi-text-[var(--base-1-main)]',
            'text-base mt-1',
            'break-all',
            FLEX_CENTER
          )}
        >
          {vigorTotal}
        </span>
      </div>
    </div>
  );
};

export default TaskAchievementDashboardVigorTotal;
