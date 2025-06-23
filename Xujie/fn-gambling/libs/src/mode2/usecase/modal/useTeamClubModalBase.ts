import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import useTeamClubModalStore from '@libs/mode2/zustand/modal/TeamClubModal';
import { useCallback, useEffect } from 'react';
import { useLocationStore } from '@mode2/zustand/locationStore';
import hallAdModelInvoker from '@mode2/usecase/announcement/command/HallAdModelInvoker';
import useModalLayoutStore, {
  HallAdModelCommandTypes,
} from '@mode2/zustand/template/modalLayoutStore';
import { AnnouncementType } from '@mode2/@types/announcementType';
import { SourceFrom } from '@mode2/usecase/announcement/command/HallAdModelCommand';

/**
 * 彈窗出現時機：視運營情況決定開啟時機。
 * 點擊右上角關閉視窗，關閉後則不會再出現，直到下一次重新開啟或是登出再登入 App。
 * @returns
 */
export const useTeamClubModalBase = () => {
  const location = useLocationStore((state) => state.location);
  const hallAdModelCommandTypes = useModalLayoutStore(
    (state) => state.hallAdModelCommandTypes
  );

  const setShowTeamClubModal = useTeamClubModalStore(
    (state) => state.setShowTeamClubModal
  );
  const appStartShownSeveralTimes = useTeamClubModalStore(
    (state) => state.appStartShownSeveralTimes
  );

  useEffect(() => {
    return () => {
      setShowTeamClubModal(false);
    };
  }, []);

  // appStartShownSeveralTimes app 啟動後顯示過幾次，限制顯示一次，
  const onTeamClubShowAction = useCallback(
    (command: HallAdModelCommandTypes) => {
      if (command.from === SourceFrom.WEB_SOCKET) {
        setShowTeamClubModal(true);
        hallAdModelInvoker.removeCache(command.uniqueId);
        return;
      }

      if (appStartShownSeveralTimes < 1) {
        setShowTeamClubModal(true);
        hallAdModelInvoker.removeCache(command.uniqueId);
      } else {
        useModalLayoutStore.getState().verifyNextStep('TeamClub');
      }
    },
    [appStartShownSeveralTimes]
  );

  useEffect(() => {
    if (
      hallAdModelCommandTypes.type === AnnouncementType.TEAM_CLUB &&
      location?.pathname === BasePagePathObj.HallPage
    ) {
      onTeamClubShowAction(hallAdModelCommandTypes);
    }
  }, [hallAdModelCommandTypes, location]);
};
