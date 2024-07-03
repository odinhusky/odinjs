import { environment } from '../../../../../../environments/environment';
import { useDispatch, useSelector } from 'react-redux';
import {
  appSlice,
  totalBalanceSheetSelector,
  totalReasableSelector,
} from '../../../../../reduxStore/appSlice';
import { RootState } from '../../../../../reduxStore';
import { Avatar } from '../../../../components/Avatar';
import { IUserInfo } from '../../../../../persistant/IUserInfo';
import { AppLocalStorage } from '../../../../../persistant/localstorage';
import { AppLocalStorageKey } from '../../../../../persistant/AppLocalStorageKey';
import { CopyIcon } from '../../../../components-bs/Icons/CopyIcon';
import { formatLocaleMoney } from '../../../../utils/format';
import { ProgressBar } from '../../../../components-bs/ProgressBar';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { useInviteReward } from '../../../../hooks/useInviteReward';
import { PageContainer } from '../../../../components-bs/PageContainer';
import { GetVIPInfoResponse } from '../../../../../external/UserEndpoint';
import { ReactNode } from 'react';
import { MyPageContent } from '../../../../components-bs/MyPage';
import { BackNavigation } from '../../../../components-bs/BackNavigation/BackNavigation';

interface IMyPageProps {
  userVIPInfo: GetVIPInfoResponse;
  currentLevel: number;
}

export const MyPage = ({ userVIPInfo, currentLevel }: IMyPageProps) => {
  // const user: IUserInfo = AppLocalStorage.getItem(AppLocalStorageKey.userInfo)
  //   ? JSON.parse(AppLocalStorage.getItem(AppLocalStorageKey.userInfo) || "")
  //   : {}

  const totalBalanceSheetValue = useSelector(totalBalanceSheetSelector);
  const totalReasableValue = useSelector(totalReasableSelector);

  const { totalPrize, bonusAwaitingSettlement, fullWithdrawable } =
    useInviteReward();

  // const { messageCount } = useSelector((state: RootState) => state.app)

  // const dispatch = useDispatch()

  // const {
  //   onClickToWallet,
  //   onClickToInvite,
  //   onClickToSetting,
  //   onClickToGameRecord,
  //   onClickToPrivacyAgreement,
  //   onClickToNotification,
  //   onClickToCompanyProfile,
  // } = usePageNavigate()

  // const { onClickToIndex } = usePageNavigate()

  // const vipScore = userVIPInfo?.data?.vip_score || 0
  // const nextLevelScore = userVIPInfo?.data?.next_level_score || 1
  // const flow = userVIPInfo?.data?.flow || 0
  // const nextLevelFlow = userVIPInfo?.data?.next_level_flow || 0

  // const depositPercent = vipScore / nextLevelScore
  // const flowPercent = flow / nextLevelFlow
  return (
    <PageContainer className="">
      {/*<BackNavigation />*/}
      <MyPageContent
        className="rounded-xl bg-[var(--grayscale-25)] mt-3 mobile:mt-4"
        currentLevel={currentLevel}
        userVIPInfo={userVIPInfo}
        totalBalanceSheetValue={totalBalanceSheetValue}
        totalReasableValue={totalReasableValue}
        totalPrize={totalPrize}
        bonusAwaitingSettlement={bonusAwaitingSettlement}
        fullWithdrawable={fullWithdrawable}
      ></MyPageContent>
    </PageContainer>
  );
};
