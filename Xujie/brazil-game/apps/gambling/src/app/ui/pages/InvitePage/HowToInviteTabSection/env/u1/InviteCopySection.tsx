import { CopyInputUrlItem } from '../../../../../components-bs/CopyInputUrlItem';
import { useLazyGetInviteRewardDataQuery } from '../../../../../../external';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../reduxStore';
import useBreakpoint from '../../../../../pageTemplate/hooks/useBreakpoint';
import { useInviteConfig } from '../../../../../hooks/useInviteConfig';

export const InviteCopySection = () => {
  const isLogin = useSelector((state: RootState) => state.app.isLogin);
  const { isMobile } = useBreakpoint();

  const [
    triggerGetInviteReward,
    { currentData: inviteInfo, isFetching: isInviteInfoFetching },
  ] = useLazyGetInviteRewardDataQuery({
    pollingInterval: 0,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (isLogin) triggerGetInviteReward({});
  }, [isLogin]);

  const inviteUrl = inviteInfo?.data?.inviteUrl || '';
  const { currentConfig } = useInviteConfig();
  const isInvitationOpen = currentConfig
    ? currentConfig.isInvitationOpen
    : false;
  return !isInvitationOpen ? (
    <></>
  ) : (
    <div className="w-full text-center sm:text-left">
      <CopyInputUrlItem
        url={isLogin ? inviteUrl : location.href}
        className={'break-all text-left'}
        urlClassName="p-3.5 sm:py-3 sm:px-6 text-sm sm:text-base"
        buttonClassName={''}
      />
    </div>
  );
};
