import BasePrimaryBtn from '@components/BasePrimaryBtn';
import Icon from '@components/Icon';
import { MilestoneFnParams } from '@components/MilestoneProgressBar/MilestoneProgressProps';
import { cx } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { handleTaskCenterPageBoxClaimBtnClick } from '@mode2/action/actionTypes';
import useTaskCenterPageActions from '@libs/mode2/action/taskCenterPageAction/useTaskCenterPageActions';
import { MissionState } from '@libs/mode2/external/api/endpoint/mission/PostMissionOngoingEndpoint';
import { useTranslation } from 'react-i18next';

interface TaskAchievementDashboardMileStoneProgressBottomProps
  extends MilestoneFnParams {
  state: MissionState;
  value: number;
  boxId: number;
}

export const TaskAchievementDashboardMileStoneProgressBottom = ({
  isReached,
  state,
  value,
  boxId,
}: TaskAchievementDashboardMileStoneProgressBottomProps) => {
  const { t } = useTranslation();
  const claimed = state === MissionState.COMPLETE;
  const { handleTaskCenterPageClick } = useTaskCenterPageActions();

  return (
    <div className="">
      {claimed || (!claimed && !isReached) ? (
        <div className={cx(FLEX_ITEMS_CENTER)}>
          <Icon name="ic_task" className={cx('w-[18px] h-[18px]')} />

          <span
            className={cx('block', 'text-sm', {
              'bgi-text-[var(--transparent-white-90)]': claimed,
              'bgi-text-[var(--base-1-main)]': !claimed,
            })}
          >
            {value || 0}
          </span>
        </div>
      ) : (
        <BasePrimaryBtn
          className={cx('w-[48px] h-[18px]')}
          classNameText={cx('text-xs')}
          children={t('earn_my_rewards_withdraw_claim')}
          onClick={() => {
            handleTaskCenterPageClick({
              actionName: handleTaskCenterPageBoxClaimBtnClick,
              payload: {
                boxId,
              },
            });
          }}
        />
      )}
    </div>
  );
};

export default TaskAchievementDashboardMileStoneProgressBottom;
