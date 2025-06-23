import { useDeepEffect } from '@libs/commonUtils';
import { AnnouncementType } from '@libs/mode2/@types/announcementType';
import {
  HallAdModelCommand,
  SourceFrom,
} from '@libs/mode2/usecase/announcement/command/HallAdModelCommand';
import HallAdModelInvoker from '@libs/mode2/usecase/announcement/command/HallAdModelInvoker';
import { useLocationStore } from '@libs/mode2/zustand/locationStore';
import useModalLayoutStore from '@libs/mode2/zustand/template/modalLayoutStore';
import queryString from 'query-string';
import { v4 as uuidv4 } from 'uuid';

export const useHallPageDeepLinkWithQueryString = () => {
  const location = useLocationStore((state) => state.location);

  useDeepEffect(() => {
    if (location?.search) {
      const parsedParams = queryString.parse(location.search);

      if (String(parsedParams?.pig) === '1') {
        // 立刻開啟PiggyBank => MoneyBoxModal
        HallAdModelInvoker.addCommandFromSocket(
          new HallAdModelCommand({
            uniqueId: uuidv4(),
            orderId: -1,
            parameter: '',
            type: AnnouncementType.PIGGY_BANK,
            from: SourceFrom.IMMEDIATE,
            onShowAction: (uniqueId, type) => {
              useModalLayoutStore.getState().setHallAdModelCommandTypes({
                uniqueId: uniqueId,
                type: type,
                parameterJson: '',
                from: SourceFrom.IMMEDIATE,
              });
            },
          })
        );
      }
    }
  }, [location]);
};

export default useHallPageDeepLinkWithQueryString;
