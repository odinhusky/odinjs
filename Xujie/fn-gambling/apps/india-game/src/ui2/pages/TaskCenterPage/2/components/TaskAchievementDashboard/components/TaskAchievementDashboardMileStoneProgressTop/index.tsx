import { MilestoneFnParams } from '@components/MilestoneProgressBar/MilestoneProgressProps';
import { cx } from '@libs/commonUtils';
import { DEBOUNCE_INTERVAL_1000 } from '@libs/constant/debounce';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';
import {
  MissionBoxTipsInfoResult,
  MissionState,
} from '@libs/mode2/external/api/endpoint/mission/PostMissionOngoingEndpoint';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface TaskAchievementDashboardMileStoneProgressTopProps
  extends MilestoneFnParams {
  state: MissionState;
  tipsInfo: MissionBoxTipsInfoResult;
}

export const TaskAchievementDashboardMileStoneProgressTop = ({
  isReached,
  state,
  tipsInfo,
}: TaskAchievementDashboardMileStoneProgressTopProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState<string>('activity_bonus_unclaimable');
  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);

  useEffect(() => {
    const x = setTimeout(() => {
      if (state === MissionState.COMPLETE && isReached) {
        setName('activity_bonus_claimed');
      } else if (isReached && state !== MissionState.COMPLETE) {
        setName('activity_bonus_claimable');
      } else {
        setName('activity_bonus_unclaimable');
      }
    }, DEBOUNCE_INTERVAL_1000);

    return () => {
      clearTimeout(x);
    };
  }, [state]);

  const content = (
    <BaseCacheImg
      className="w-full"
      src={getImgUrl(EResourceLevel.V, name)}
      imgName={name}
      alt="Progress Top Image"
    />
  );

  const rewardRange = `${
    tipsInfo.rewardRange.length > 0
      ? tipsInfo.rewardRange.length === 1
        ? tipsInfo.rewardRange[0]
        : tipsInfo.rewardRange.length === 2
        ? `${tipsInfo.rewardRange[0]}-${tipsInfo.rewardRange[1]}`
        : '0'
      : '0'
  }`;

  return (
    <div className={cx('w-[64px]', 'cursor-pointer')}>
      <Tooltip
        title={t('mission_treasure_box_reward_toast', {
          rewardRange,
          damaRatio: tipsInfo.damaRatio || 0,
        })}
        placement="bottomLeft"
        autoAdjustOverflow={true}
        align={{
          offset: [0, 0], // X 軸不變，Y 軸往上或往下 5px
        }}
        open={isTooltipOpen}
        defaultOpen={false}
        trigger={'click'}
        arrow={true}
        onOpenChange={() => {
          setIsTooltipOpen((prevState) => !prevState);
        }}
        color={'var(--base-2-variant1)'}
        overlayClassName={cx(
          'w-[274px] bgi-border-[var(--base-1-light)] text-xs',
          'rounded',
          'border bgi-border-[var(--base-1-main)] after-rounded'
        )}
      >
        {content}
      </Tooltip>
    </div>
  );
};

export default TaskAchievementDashboardMileStoneProgressTop;
