import { useBreakPoint } from '@libs/commonUtils';
import {
  EHeaderType,
  useHeaderStore,
} from '@libs/mode2/zustand/components/headerStore';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import {
  ActivityRecordPageTypes,
  useActivityRecordPageStore,
} from '@libs/mode2/zustand/page/activityRecordPageStore';
import { useNavigateClick } from '@mode2/usecase/useNavPageClick';

export const useActivityRecordPageHeaderSetting = () => {
  const location = useLocation();
  const navigate = useNavigateClick();
  const { isDesktop } = useBreakPoint();

  const tabIndex = useActivityRecordPageStore((state) => state.tabIndex);
  const setConfig = useHeaderStore((state) => state.setConfig);
  const setTabIndex = useActivityRecordPageStore((state) => state.setTabIndex);
  console.log('!! tabIndex', tabIndex);
  const i18nKey =
    tabIndex === ActivityRecordPageTypes.INVITE_WHEEL_WITHDRAWAL_RECORD_CONTENT
      ? 'earn_rewards_detail_withdrawal_history'
      : 'deposit_wheel_my_rewards_page_title';

  useEffect(() => {
    if (isDesktop) {
      setConfig({
        type: EHeaderType.Main,
      });
    } else {
      setConfig({
        type: EHeaderType.Common,
        title: { i18nKey },
        onBack: () => {
          navigate(-1);
        },
      });
    }
  }, [isDesktop, tabIndex]);

  useEffect(() => {
    const { tab } = location.state || {};
    if (tab !== undefined) {
      setTabIndex(tab);
    }

    return () => {
      setTabIndex(ActivityRecordPageTypes.DEFAULT);
    };
  }, [location]);
};
export default useActivityRecordPageHeaderSetting;
