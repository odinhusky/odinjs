import { useTaskCenterPageStore } from '@mode2/zustand/page/TaskCenterPage/taskCenterPageStore';
import { cx } from '@libs/commonUtils';
import { MissionType } from '@mode2API/endpoint/mission/PostMissionOngoingEndpoint';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import useTaskCenterPageActions from '@mode2/action/taskCenterPageAction/useTaskCenterPageActions';
import { handleTaskCenterPageMissionTabClick } from '@mode2/action/actionTypes';
import { useMemo } from 'react';
import { Badge } from 'antd';
import renderI18N from '@libs/commonUtils/renderI18N';
import { useTranslation } from 'react-i18next';

export const TaskTypeTabs = () => {
  const { t } = useTranslation();
  const currentMissionType = useTaskCenterPageStore(
    (state) => state.currentMissionType
  );

  const missionTipBadges = useTaskCenterPageStore(
    (state) => state.missionTipBadges
  );

  const { handleTaskCenterPageClick } = useTaskCenterPageActions();

  const missionList = useTaskCenterPageStore((state) => state.missionList);

  const tabs = useMemo(() => {
    const defaultTabs = [
      {
        type: MissionType.NEW_PLAYER,
        i18nKey: t('mission_new_player_bonus_tab'),
        badgesNumber: missionTipBadges.newPlayerBadge,
      },
      {
        type: MissionType.DAILY,
        i18nKey: t('mission_daily_mission_tab'),
        badgesNumber: missionTipBadges.dailyBadge,
      },
    ];

    // 新人福利活動結束只顯示日常任務
    if (!missionTipBadges.isNewPlayerActivityPeriod) {
      return defaultTabs.filter((tab) => tab.type === MissionType.DAILY);
    }

    return defaultTabs;
  }, [missionTipBadges, missionList]);

  return (
    <div
      className={cx(
        'border border-b-0 border-[var(--base-1-main)] rounded-t-md',
        'z-10'
      )}
    >
      <div
        className={cx(
          'h-16',
          'rounded-t-md',
          'flex justify-between',
          'bgi-[var(--base-2-variant11)]',
          'border-b-[var(--transparent-white-10)] border-b'
          // 'sticky top-20 mx-0.5'
        )}
      >
        {tabs.map((item, index) => {
          return (
            <div
              className={cx(
                ' w-full h-full',
                'relative flex items-center justify-center cursor-pointer',
                {
                  'rounded-tl-md': item.type === MissionType.NEW_PLAYER,
                  'rounded-tr-md': item.type === MissionType.DAILY,
                  // 'bgi-[var(--base-2-variant4)]':
                  //   item.type === currentMissionType,
                }
              )}
              key={index}
              onClick={() => {
                handleTaskCenterPageClick({
                  actionName: handleTaskCenterPageMissionTabClick,
                  payload: {
                    type: item.type,
                  },
                });
              }}
            >
              <p
                className={cx(
                  'bgi-text-[var(--base-2-variant1)]',
                  'text-lg font-medium',
                  {
                    'bgi-text-[var(--grayscale-100)]':
                      item.type === currentMissionType,
                  }
                )}
              >
                {renderI18N(item, t)}
              </p>
              {item.type === currentMissionType ? (
                <img
                  className={cx(
                    'w-full h-16',
                    'absolute bottom-0 left-0 top-0'
                  )}
                  src={getImgUrl(EResourceLevel.V, 'bg_active_tab_light')}
                  alt="active"
                />
              ) : null}

              {item.badgesNumber > 0 ? (
                <Badge
                  classNames={{
                    root: cx(
                      'absolute z-[2] -translate-x-0 top-1.5 right-3 !min-w-auto !border-[0px] in_box_button'
                    ),
                    indicator: cx(
                      '!text-xs !h-4 !min-w-4 !p-0 !max-w-5 !shadow-none !rounded-lg'
                    ),
                  }}
                  size="small"
                  count={item.badgesNumber}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskTypeTabs;
