import { useRechargeSecretPageBase } from '@mode2/usecase/page/rechargeSecretPage/useRechargeSecretPageBase';
import { useRechargeSecretPageOverride } from './useRechargeSecretPageOverride';
import cx from '@commonUtils/cx';
import React, { useMemo } from 'react';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import RechargeSecretPlayerInfo from './components/RechargeSecretPlayerInfo';
import RechargeSecretPayNowButton from './components/RechargeSecretPayNowButton';
import RechargeSecretProductOptions from './components/RechargeSecretProductOptions';
import RechargeSecretPayChannelList from './components/RechargeSecretPayChannelList';
import RechargeContent from '@components/RechargeContent';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { UserRoleType } from '@mode2/@types/userRoleTypes';
import useRechargeSecretPageStore from '@mode2/zustand/page/rechargeSecretPageStore';

const Content = () => {
  return (
    <div
      className={cx(
        MOBILE_BREAK_POINT_MAX_WIDTH,
        'm-auto',
        'min-h-screen',
        '-mx-4 bottom-0',
        'flex flex-col gap-4 pb-20'
      )}
      style={{
        backgroundImage: `url(${getImgUrl(
          EResourceLevel.V,
          'secret_bonus_background'
        )})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100%',
        backgroundPosition: 'center 0rem',
      }}
    >
      <RechargeSecretPlayerInfo />

      <RechargeSecretProductOptions />

      <RechargeSecretPayChannelList />

      <RechargeSecretPayNowButton />
    </div>
  );
};
export const RechargeSecretPage = () => {
  useRechargeSecretPageBase();
  useRechargeSecretPageOverride();

  const userRole = useUserProfileStore((state) => state.userRole);
  const isShowRechargeContent = useRechargeSecretPageStore(
    (state) => state.isShowRechargeContent
  );

  const ruleContent = useMemo(() => {
    if (isShowRechargeContent) {
      return <RechargeContent />;
    }
    switch (userRole) {
      case UserRoleType.NONE:
        return null;
      case UserRoleType.GUEST:
        return null;
      case UserRoleType.PLAYER:
        return <RechargeContent />;
      case UserRoleType.USER:
        return <Content />;
      default:
        return null;
    }
  }, [userRole, isShowRechargeContent]);

  return <>{ruleContent}</>;
  // return (
  //   <div
  //     className={cx(
  //       MOBILE_BREAK_POINT_MAX_WIDTH,
  //       'm-auto',
  //       'min-h-screen',
  //       '-mx-4 bottom-0',
  //       'flex flex-col gap-4 pb-20'
  //     )}
  //     style={{
  //       backgroundImage: `url(${getImgUrl(
  //         EResourceLevel.V,
  //         'secret_bonus_background'
  //       )})`,
  //       backgroundRepeat: 'no-repeat',
  //       backgroundSize: '100%',
  //       backgroundPosition: 'center 0rem',
  //     }}
  //   >
  //     <RechargeSecretPlayerInfo />
  //
  //     <RechargeSecretProductOptions />
  //
  //     <RechargeSecretPayChannelList />
  //
  //     <RechargeSecretPayNowButton />
  //   </div>
  // );
};

export default RechargeSecretPage;
