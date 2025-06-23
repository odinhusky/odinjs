import { cx } from '@libs/commonUtils';
import TaskAchievementDashboard from './components/TaskAchievementDashboard';
import TaskCenterRulesContent from './components/TaskCenterRulesContent';
import TaskStateListContent from './components/TaskStateListContent';
import TaskTypeTabs from './components/TaskTypeTabs';
import useMobileTaskCenterPageBaseOverride from './useMobileTaskCenterPageBaseOverride';
import { useTaskCenterPageBase } from '@mode2/usecase/page/taskCenterPage/useTaskCenterPageBase';
import AffixHeaderBottomWrapper from '@libs/mode2/components/AffixHeaderBottomWrapper';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { useState } from 'react';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';

export const TaskCenterPage = () => {
  useTaskCenterPageBase();
  useMobileTaskCenterPageBaseOverride();

  const bgMainPath = getImgUrl(EResourceLevel.V, 'casino_background');
  const [isAffixed, setAffixed] = useState(false);

  return (
    <div className={cx('flex flex-col gap-4', 'py-3')}>
      <TaskAchievementDashboard />

      <div className="rounded-md">
        <AffixHeaderBottomWrapper
          onChange={(affixed) => {
            setAffixed(affixed === true);
          }}
          affixContainerClass={'z-10'}
        >
          <div
            className={cx(MOBILE_BREAK_POINT_MAX_WIDTH, '-mx-4', {
              'bgi-[var(--background-header)] ': isAffixed,
            })}
          >
            <div
              className={cx('px-4', {
                'pt-4': isAffixed,
              })}
              style={{
                backgroundImage: isAffixed ? `url(${bgMainPath})` : '',
                backgroundRepeat: isAffixed ? 'no-repeat' : '',
                backgroundAttachment: isAffixed ? 'fixed' : '',
                backgroundSize: isAffixed ? '750px' : '',
                backgroundPosition: isAffixed ? 'center top' : '',
              }}
            >
              <TaskTypeTabs />
            </div>
          </div>
        </AffixHeaderBottomWrapper>

        <div className="border border-t-0 border-[var(--base-1-main)]  rounded-b-md">
          <TaskStateListContent />
          <TaskCenterRulesContent />
        </div>
      </div>
    </div>
  );
};

export default TaskCenterPage;

// TaskCenterPage
