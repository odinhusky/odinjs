import { SourceFrom } from '@mode2/usecase/announcement/command/HallAdModelCommand';

``;
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { useCallback, useEffect } from 'react';
import { useLocationStore } from '@mode2/zustand/locationStore';
import hallAdModelInvoker from '@mode2/usecase/announcement/command/HallAdModelInvoker';
import useModalLayoutStore, {
  HallAdModelCommandTypes,
} from '@mode2/zustand/template/modalLayoutStore';
import { AnnouncementType } from '@mode2/@types/announcementType';
import useRankingActivityModalStore from '@libs/mode2/zustand/modal/RankingActivityModal';
// import dayjs from '@commonUtils/localizedDayjs';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { RankingActivityShowTimeData } from '@libs/mode2/action/rankingActivityModalAction';
import sdkUtils from '@libs/mode2/utils/sdk';
import userLocalForage, {
  UserLocalforageStoreKeys,
} from '@mode2/localforage/user';
import { useDeepEffect } from '@libs/commonUtils';
import { usePostPromoteRankingJackpotMutation } from '@libs/mode2/external/api';
import { today } from '@libs/constant/date';

// 出現時機應該也是根據後台控制的
export const useRankingActivityModalBase = () => {
  const hallAdModelCommandTypes = useModalLayoutStore(
    (state) => state.hallAdModelCommandTypes
  );

  const setShowRankingActivityModal = useRankingActivityModalStore(
    (state) => state.setShowRankingActivityModal
  );

  const appStartShownSeveralTimes = useRankingActivityModalStore(
    (state) => state.appStartShownSeveralTimes
  );

  const rankingActivityStore = userLocalForage.getInstance(
    UserLocalforageStoreKeys.RANKING_ACTIVITY
  );

  const [postPromoteRankingJackpot, { isSuccess, data }] =
    usePostPromoteRankingJackpotMutation();

  const setRankingRulesResult = useRankingActivityModalStore(
    (state) => state.setRankingRulesResult
  );

  useDeepEffect(() => {
    if (isSuccess && data) {
      setRankingRulesResult(data);
    }
  }, [isSuccess, data]);

  // appStartShownSeveralTimes app 啟動後顯示過幾次，限制顯示一次，
  const onRankingActivityShowAction = useCallback(
    async (command: HallAdModelCommandTypes) => {
      const id = useUserProfileStore.getState().id;
      const value = await rankingActivityStore.getItem<string>(id.toString());
      const localRankingActivityShowTimeMap: RankingActivityShowTimeData =
        JSON.parse(sdkUtils.decrypt(value!) || '{}');
      // const currentTime = dayjs().unix();

      if (command.from === SourceFrom.WEB_SOCKET) {
        setShowRankingActivityModal(true);
        // 顯示即獲取  parameter
        postPromoteRankingJackpot();
        hallAdModelInvoker.removeCache(command.uniqueId);
        return;
      }

      const isDisabledToday =
        (localRankingActivityShowTimeMap?.disableDuration || 0) >= +today;

      if (
        (!localRankingActivityShowTimeMap?.disableDuration ||
          !isDisabledToday) &&
        appStartShownSeveralTimes < 1
      ) {
        setShowRankingActivityModal(true);
        // 顯示即獲取  parameter
        postPromoteRankingJackpot();
        hallAdModelInvoker.removeCache(command.uniqueId);
      } else {
        useModalLayoutStore.getState().verifyNextStep('RankingActivity');
      }
    },
    [appStartShownSeveralTimes]
  );

  useEffect(() => {
    const location = useLocationStore.getState().location;
    const isHallPage = location?.pathname === BasePagePathObj.HallPage;

    if (
      hallAdModelCommandTypes.type === AnnouncementType.RANKINGS &&
      isHallPage
    ) {
      onRankingActivityShowAction(hallAdModelCommandTypes);
    }
  }, [hallAdModelCommandTypes]);
};

export default useRankingActivityModalBase;
