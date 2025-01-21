import { useBreakPoint } from '@libs/commonUtils';
import { formatMoney } from '@libs/mode2/utils';
import {
  EHeaderType,
  useHeaderStore,
} from '@libs/mode2/zustand/components/headerStore';
import { useMode2InvitePageRankingListStore } from '@mode2/zustand/page/invitePageStore';
import { useEffect } from 'react';

export const useInvitePageHeaderSetting = () => {
  const { isDesktop } = useBreakPoint();

  const setConfig = useHeaderStore((state) => state.setConfig);
  const showLastData = useMode2InvitePageRankingListStore(
    (state) => state.showLastData
  );
  const setShowLastData = useMode2InvitePageRankingListStore(
    (state) => state.setShowLastData
  );

  useEffect(() => {
    if (isDesktop) {
      setConfig({
        type: EHeaderType.Main,
      });
    } else {
      setConfig({
        type: EHeaderType.Common,
        title: showLastData
          ? {
              i18nKey: 'earn_money_team_data_content_last_week',
            }
          : {
              i18nKey: 'earn_money_earn_header_invite_earn',
              i18nOption: { amount: formatMoney(10000) },
            },
        onBack: showLastData ? () => setShowLastData(false) : undefined,
      });
    }
  }, [isDesktop, showLastData]);
};

export default useInvitePageHeaderSetting;
