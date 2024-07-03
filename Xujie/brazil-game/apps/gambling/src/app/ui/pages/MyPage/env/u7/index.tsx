import { useSelector } from 'react-redux';
import {
  totalBalanceSheetSelector,
  totalReasableSelector,
} from '../../../../../reduxStore/appSlice';
import { useInviteReward } from '../../../../hooks/useInviteReward';
import { PageContainer } from '../../../../components-bs/PageContainer';
import { GetVIPInfoResponse } from '../../../../../external/UserEndpoint';
import U7UserInfoStatusPopover from '../../../../popovers/UserInfoStatusPopover/env/u7';
import cx from '../../../../utils/cx';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import { environment } from 'apps/gambling/src/environments/environment';

interface IMyPageProps {
  userVIPInfo: GetVIPInfoResponse;
  currentLevel: number;
}

export const U7MyPage = ({ userVIPInfo, currentLevel }: IMyPageProps) => {
  const totalBalanceSheetValue = useSelector(totalBalanceSheetSelector);
  const totalReasableValue = useSelector(totalReasableSelector);

  const { totalPrize, bonusAwaitingSettlement, fullWithdrawable } =
    useInviteReward();
  const { isMobile } = useBreakpoint();
  return (
    <PageContainer style={
      isMobile
        ? {
            maxHeight: 'max-content',
            minHeight:'100%',
            background: `url(assets/${environment.uVersion}/bg_me.png)  50%  center / cover`,
          }
        : {}
    } >
      <U7UserInfoStatusPopover
        userVIPInfo={userVIPInfo}
        currentLevel={currentLevel}
        onClose={() => {}}
        totalBalanceSheetValue={totalBalanceSheetValue}
        totalReasableValue={totalReasableValue}
        totalPrize={totalPrize}
        bonusAwaitingSettlement={bonusAwaitingSettlement}
        fullWithdrawable={fullWithdrawable}
      />
    </PageContainer>
  );
};

export default U7MyPage;
