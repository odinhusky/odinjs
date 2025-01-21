import useDeepEffect from '@libs/commonUtils/hooks/useDeepEffect';
import { usePostPromoteDailyDetailMutation } from '@libs/mode2/external/api';
import { useTeamDataDetailModalStore } from '@libs/mode2/zustand/components/teamDataDetailModalStore';
import { useEffect } from 'react';

export const useTeamDataDetailList = () => {
  const [PostPromoteDailyDetailEndpoint, { data: PromoteDailyDetailData }] =
    usePostPromoteDailyDetailMutation();
  const setTeamDataDetailList = useTeamDataDetailModalStore(
    (state) => state.setTeamDataDetailList
  );

  useDeepEffect(() => {
    if (PromoteDailyDetailData) {
      setTeamDataDetailList(PromoteDailyDetailData);
    }
  }, [PromoteDailyDetailData]);

  useEffect(() => {
    PostPromoteDailyDetailEndpoint();
  }, []);
};
