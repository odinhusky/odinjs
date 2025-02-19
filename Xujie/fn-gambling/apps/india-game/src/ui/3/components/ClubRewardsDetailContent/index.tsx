import { cx } from '@libs/commonUtils';
import {
  EDetailTableId,
  useRewardsDetailStore,
} from '@libs/mode2/zustand/page/rewardsDetailStore';
import TeamBetReward from './components/TeamBetReward';
import { Fragment, useMemo } from 'react';
import TeamAllReward from './components/TeamAllReward';
import TeamDepositReward from './components/TeamDepositReward';
import TeamInviteReward from './components/TeamInviteReward';
import TeamInviteTaskReward from './components/TeamInviteTaskReward';
import { useTranslation } from 'react-i18next';
import './index.scss';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';

const ClubRewardsDetailContent = () => {
  const { t } = useTranslation();
  const recordDetailTab = useRewardsDetailStore(
    (state) => state.recordDetailTab
  );
  const activeDetailTableId = useRewardsDetailStore(
    (state) => state.activeDetailTableId
  );
  const setActiveDetailTable = useRewardsDetailStore(
    (state) => state.setActiveDetailTable
  );

  const table = useMemo(() => {
    switch (activeDetailTableId) {
      case EDetailTableId.DETAIL_ALL:
        return <TeamAllReward />;
      case EDetailTableId.DETAIL_BET:
        return <TeamBetReward />;
      case EDetailTableId.DETAIL_DEPOSIT:
        return <TeamDepositReward />;
      case EDetailTableId.DETAIL_INVITE:
        return <TeamInviteReward />;
      case EDetailTableId.DETAIL_INVITE_TASK:
        return <TeamInviteTaskReward />;
      default:
        return null;
    }
  }, [activeDetailTableId]);

  return (
    <div className="pb-10">
      <div
        className={cx(
          'flex justify-center items-center w-full overflow-hidden'
        )}
      >
        {recordDetailTab.children?.map((item, index) => {
          const isLastItem = index === recordDetailTab.children!.length - 1;

          return (
            <Fragment key={index}>
              <div
                className={cx(
                  'mt-2.5 flex items-center justify-center flex-auto cursor-pointer',
                  {
                    'bgi-text-[var(--base-1-main)] border-[var(--base-1-main)]':
                      activeDetailTableId === item.id,
                    'bgi-text-[var(--grayscale-100)]':
                      activeDetailTableId !== item.id,
                  }
                )}
                key={item.id}
                onClick={() => setActiveDetailTable(item.id)}
              >
                <span
                  className={cx(
                    'pb-2.5 box-border text-base font-medium',
                    'border-b border-transparent',
                    {
                      ' border-[var(--base-1-main)]':
                        activeDetailTableId === item.id,
                    }
                  )}
                >
                  {t(item.label)}
                </span>
              </div>

              {!isLastItem && (
                <img
                  src={getImgUrl(EResourceLevel.ICONS, 'divider')}
                  alt="separator"
                  className="w-1.5 h-5"
                />
              )}
            </Fragment>
          );
        })}
      </div>
      {table}
    </div>
  );
};
export default ClubRewardsDetailContent;
