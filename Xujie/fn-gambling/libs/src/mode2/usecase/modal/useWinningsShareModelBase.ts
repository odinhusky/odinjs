import { usePostPromoteWinningShareMutation } from '@mode2API/index';
import { useCallback, useEffect } from 'react';
import useWinningsShareModelStore from '@mode2/zustand/modal/WinningsShareModel';
import { AnnouncementType } from '@mode2/@types/announcementType';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import useModalLayoutStore, {
  HallAdModelCommandTypes,
} from '@mode2/zustand/template/modalLayoutStore';
import { useLocationStore } from '@mode2/zustand/locationStore';
import hallAdModelInvoker from '@mode2/usecase/announcement/command/HallAdModelInvoker';

const WinningsShareModelWhitelistPage: string[] = [
  BasePagePathObj.HallPage,
  BasePagePathObj.MoreGamePage,
];
export const useWinningsShareModelBase = () => {
  const [postPromoteWinningShare, { data, isSuccess }] =
    usePostPromoteWinningShareMutation();
  const location = useLocationStore((state) => state.location);
  const hallAdModelCommandTypes = useModalLayoutStore(
    (state) => state.hallAdModelCommandTypes
  );
  const setShowWinningsShareModel = useWinningsShareModelStore(
    (state) => state.setShowWinningsShareModel
  );
  const setWinningAmount = useWinningsShareModelStore(
    (state) => state.setWinningAmount
  );

  useEffect(() => {
    if (isSuccess && data) {
      setWinningAmount(data.winningAmount);
    }
  }, [isSuccess, data]);

  const onWinningsShareShowAction = useCallback(
    (command: HallAdModelCommandTypes) => {
      // 收到通知，就呼叫，並解先reset 之前的 winningAmount
      setShowWinningsShareModel(true);
      // 顯示即獲取 parameter
      setWinningAmount(0);
      postPromoteWinningShare();
      hallAdModelInvoker.removeCache(command.uniqueId);
    },
    []
  );

  // QA說後端有設置顯示間隔為 十分鐘 / 次
  // 使用 Debounced 因來源於 Web Socket 順序會無預警被首頁 Announcements 影響導致無法顯示
  // 並且 location 需要 deps 方式
  useEffect(() => {
    const isPass = WinningsShareModelWhitelistPage.includes(
      location?.pathname || ''
    );
    if (
      hallAdModelCommandTypes.type === AnnouncementType.WINNINGS_SHARE &&
      isPass
    ) {
      onWinningsShareShowAction(hallAdModelCommandTypes);
    }
  }, [hallAdModelCommandTypes, location]);
};

export default useWinningsShareModelBase;
