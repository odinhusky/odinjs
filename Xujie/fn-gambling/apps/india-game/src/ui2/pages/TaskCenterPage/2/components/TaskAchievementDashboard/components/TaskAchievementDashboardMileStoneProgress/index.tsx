import MilestoneProgressBar from '@components/MilestoneProgressBar';
import { Milestone } from '@components/MilestoneProgressBar/MilestoneProgressProps';
import { cx, useObserverElementMetrics } from '@libs/commonUtils';
import TaskAchievementDashboardMileStoneProgressTop from '../TaskAchievementDashboardMileStoneProgressTop';
import TaskAchievementDashboardMileStoneProgressBottom from '../TaskAchievementDashboardMileStoneProgressBottom';
import { contaienrPaddingRightControl } from '../..';
import { useTaskCenterPageStore } from '@libs/mode2/zustand/page/TaskCenterPage/taskCenterPageStore';
import { useEffect } from 'react';

export const TaskAchievementDashboardMileStoneProgress = () => {
  const { elementRef: containerRef, elementMetrics: containerMetrics } =
    useObserverElementMetrics<HTMLDivElement>();

  const { elementRef: unitRef, elementMetrics: unitMetrics } =
    useObserverElementMetrics<HTMLDivElement>();

  const minusDiff = unitMetrics.width / 2 || 32;

  const paddingRightControllClass = contaienrPaddingRightControl;

  const dashPrevCount = useTaskCenterPageStore((state) => state.dashPrevCount);
  const vigor = useTaskCenterPageStore((state) => state.dashboardInfo.vigor);
  const vigorBoxItems = useTaskCenterPageStore(
    (state) => state.dashboardInfo.vigorBoxItems
  );

  // 組出渲染畫面得資料
  const milestones: Milestone[] = vigorBoxItems.map((item) => ({
    ...item,
    value: item.requiredVigor,
    renderTop: (params) => (
      <TaskAchievementDashboardMileStoneProgressTop
        {...params}
        state={item.state}
        tipsInfo={item.tipsInfo}
      />
    ),
    renderBottom: (params) => (
      <TaskAchievementDashboardMileStoneProgressBottom
        {...params}
        state={item.state}
        value={item.requiredVigor}
        boxId={item.id}
      />
    ),
  }));

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current?.scrollBy({
        left: -1 * containerMetrics.width,
        behavior: 'smooth',
      });
    }
  }, [dashPrevCount]);

  const dashNexrCount = useTaskCenterPageStore((state) => state.dashNextCount);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current?.scrollBy({
        left: containerMetrics.width,
        behavior: 'smooth',
      });
    }
  }, [dashNexrCount]);

  return (
    <div
      ref={containerRef}
      className={cx(
        'w-auto flex-1',
        'overflow-x-auto',
        paddingRightControllClass
      )}
    >
      <div className="w-[64px]" ref={unitRef} />
      <div
        className={cx('h-[114px]', 'pl-8', paddingRightControllClass)}
        style={{
          width:
            milestones.length > 3
              ? `${
                  milestones.length * (containerMetrics.width / 4 || 64) -
                  minusDiff
                }px`
              : `calc(100%-${minusDiff}px)`,
        }}
      >
        <MilestoneProgressBar
          // strokeColor={'var(--base-2-variant17)'} // 壓不住
          strokeClass={'!bgi-[var(--base-2-variant17)]'}
          milestones={milestones}
          currentValue={vigor}
          progressBarContainerClass={cx('-translate-y-[0] top-[63%]')}
          trailClass={cx('bg-shadow-[var(--progress-inset-shadow)]')}
        />
      </div>
    </div>
  );
};

export default TaskAchievementDashboardMileStoneProgress;
