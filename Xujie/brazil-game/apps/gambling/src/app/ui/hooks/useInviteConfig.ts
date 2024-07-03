import { useLazyGetInviteConfigQuery } from '../../external';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxStore';

type IConfigItem = {
  num: string;
  reward: string;
};

type IConfigData = {
  isInvitationOpen: boolean;
  items: IConfigItem[];
};

export const useInviteConfig = (props?: any) => {
  const [triggerGetInviteConfig, { isLoading, data, isFetching, currentData }] =
    useLazyGetInviteConfigQuery();
  const [currentConfig, setCurrentConfig] = useState<IConfigData>({
    isInvitationOpen: false,
    items: [],
  });
  const isLogin = useSelector((state: RootState) => state.app.isLogin);

  useEffect(() => {
    if (isLogin) {
      triggerGetInviteConfig({});
    }
  }, [isLogin]);

  useEffect(() => {
    // const currentProxyType = currentData?.data.filter(item => item.proxyType === 0);
    if (currentData) {
      const invitationFlag = currentData.data.invitationFlag;
      const items: IConfigItem[] = JSON.parse(
        currentData.data.firstRechargeLevel
      );
      setCurrentConfig({
        isInvitationOpen: invitationFlag === 1,
        items: items,
      });
    }
  }, [currentData]);

  return {
    currentConfig,
  };
};
