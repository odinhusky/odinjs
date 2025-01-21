import { cx } from '@libs/commonUtils';
import {
  EDetailTableId,
  useRewardsDetailStore,
} from '@libs/mode2/zustand/page/rewardsDetailStore';
import TeamBetReward from './components/TeamBetReward';
import { useMemo } from 'react';
import TeamAllReward from './components/TeamAllReward';
import TeamDepositReward from './components/TeamDepositReward';
import TeamInviteReward from './components/TeamInviteReward';
import TeamInviteTaskReward from './components/TeamInviteTaskReward';
import { useTranslation } from 'react-i18next';

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
        return <></>;
    }
  }, [activeDetailTableId]);
  return (
    <div className="pb-10">
      <div className="flex justify-stretch h-9 mx-auto mt-3 items-center rounded w-full overflow-hidden bgi-[var(--grayscale-15)] flex-1">
        {recordDetailTab.children?.map((item, index) => (
          <div
            className={cx(
              'px-2  text-[var(--grayscale-50)]',
              ' text-center relative h-full flex items-center justify-center flex-auto',
              activeDetailTableId === item.id
                ? ' bgi-[var(--linear-1)] after:left-0 after:bottom-0 after:absolute after:block after:bgi-[var(--linear-3)] after:w-full after:h-0.5'
                : ''
            )}
            key={item.id}
            onClick={() => setActiveDetailTable(item.id)}
          >
            <span
              className={cx(
                activeDetailTableId === item.id
                  ? 'bgi-text-[var(--base-2-main)] font-bold '
                  : '',
                ' text-sm'
              )}
            >
              {t(item.label)}
            </span>
          </div>
        ))}
      </div>
      {table}
    </div>
  );
};
export default ClubRewardsDetailContent;
