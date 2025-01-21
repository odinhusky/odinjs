import { Earn } from './components/Earn';
import './index.scss';
import { Statistics } from './components/Statistics';
import { TeamData } from './components/TeamData';
import { RankingList } from './components/RankingList';
import InvitePageTabList from './components/InvitePageTabList';
import {
  useMode2InvitePageRankingListStore,
  useMode2InviteTabStore,
} from '@mode2/zustand/page/invitePageStore';
import { InvitePageTabType } from '@mode2/@types/invitePageTabTyp';
import PageDeskTopHeader from '@components/PageDeskTopHeader';
import { cx } from '@libs/commonUtils';
import { TeamDataDetailModal } from '@modals/TeamDataDetailModal';
import { formatMoney } from '@mode2/utils';
import useMode2InvitePageBase from '@libs/mode2/usecase/page/invitePage/useMode2InvitePageBase';

const InvitePage = () => {
  const inviteCurTab = useMode2InviteTabStore((state) => state.inviteCurTab);
  const showLastData = useMode2InvitePageRankingListStore(
    (state) => state.showLastData
  );
  const setShowLastData = useMode2InvitePageRankingListStore(
    (state) => state.setShowLastData
  );

  useMode2InvitePageBase();

  return (
    <div
      className={cx(
        'invite',
        'pt-0 pb-0 tablet:py-8',
        'mb-8 mobile:mb-10 tablet:mb-8'
      )}
    >
      <div className={cx('tablet:mb-5')}>
        <PageDeskTopHeader
          headerTitle={
            showLastData
              ? {
                  i18nKey: 'earn_money_team_data_content_last_week',
                }
              : {
                  i18nKey: 'earn_money_earn_header_invite_earn',
                  i18nOption: {
                    amount: formatMoney(10000),
                  },
                }
          }
          onBack={showLastData ? () => setShowLastData(false) : undefined}
        />
      </div>

      <InvitePageTabList />
      {inviteCurTab === InvitePageTabType.EARN ? <Earn /> : null}
      {inviteCurTab === InvitePageTabType.STATISTICS ? <Statistics /> : null}
      {inviteCurTab === InvitePageTabType.TEAM_DATA ? <TeamData /> : null}
      {inviteCurTab === InvitePageTabType.RANKING_LIST ? <RankingList /> : null}

      {/* TeamData详情popup */}
      <TeamDataDetailModal />
    </div>
  );
};
export default InvitePage;
