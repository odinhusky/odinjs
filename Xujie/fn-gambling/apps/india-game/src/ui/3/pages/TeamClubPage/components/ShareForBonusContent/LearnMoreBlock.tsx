import useImgUrlByBreakPoint from '@commonUtils/hooks/useImgUrlByBreakPoint';
import { handleTeamClubPageShareForBonusTabLearnMoreClick } from '@mode2/action/teamClubPageAction/actionType';
import useTeamClubPageActions from '@mode2/action/teamClubPageAction/useTeamClubPageActions';

/** 頁面跳轉link */
const LearnMoreBlock = () => {
  const { getImgUrlByBreakPoint } = useImgUrlByBreakPoint();

  const { handleTeamClubPageClick } = useTeamClubPageActions();

  return (
    <img
      src={getImgUrlByBreakPoint('learn_more')}
      alt="learn"
      className="cursor-pointer"
      onClick={() => {
        handleTeamClubPageClick({
          actionName: handleTeamClubPageShareForBonusTabLearnMoreClick,
        });
      }}
    />
  );
};

export default LearnMoreBlock;
