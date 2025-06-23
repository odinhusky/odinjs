import Icon from '@components/Icon';
import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { contaienrPaddingRightControl } from '../..';
import useTaskCenterPageActions from '@libs/mode2/action/taskCenterPageAction/useTaskCenterPageActions';
import {
  handleTaskCenterPageDashBoardNextIconBtnClick,
  handleTaskCenterPageDashBoardPrevIconBtnClick,
} from '@mode2/action/actionTypes';
import { useTaskCenterPageStore } from '@libs/mode2/zustand/page/TaskCenterPage/taskCenterPageStore';

export const TaskAchievementDashboardController = () => {
  const { handleTaskCenterPageClick } = useTaskCenterPageActions();

  const vigorBoxItems = useTaskCenterPageStore(
    (state) => state.dashboardInfo.vigorBoxItems
  );

  // 如果數量小於等於4 則不顯示
  const totalLength = vigorBoxItems.length;
  if (totalLength <= 4) return <></>;

  return (
    <div className={cx('w-full', FLEX_CENTER, contaienrPaddingRightControl)}>
      <div className={cx('h-[28px]', FLEX_ITEMS_CENTER, 'gap-3')}>
        <Icon
          name="ic_arrow_left_color"
          className={cx('w-7 h-7 cursor-pointer')}
          onClick={() => {
            handleTaskCenterPageClick({
              actionName: handleTaskCenterPageDashBoardPrevIconBtnClick,
            });
          }}
        />
        <Icon
          name="ic_arrow_right_color"
          className={cx('w-7 h-7 cursor-pointer')}
          onClick={() => {
            handleTaskCenterPageClick({
              actionName: handleTaskCenterPageDashBoardNextIconBtnClick,
            });
          }}
        />
      </div>
    </div>
  );
};

export default TaskAchievementDashboardController;
