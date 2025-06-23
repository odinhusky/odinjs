import useGlobalAnnouncementStore from '@mode2/zustand/modal/GlobalAnnouncementModal';
import { useCallback, useEffect } from 'react';
import { useLocationStore } from '@mode2/zustand/locationStore';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import useModalLayoutStore, {
  HallAdModelCommandTypes,
} from '@mode2/zustand/template/modalLayoutStore';
import { SocketNotice } from '@mode2/usecase/announcement/command/HallAdModelCommand';
import { useTranslation } from 'react-i18next';
import hallAdModelInvoker from '@mode2/usecase/announcement/command/HallAdModelInvoker';

const GlobalNoticeWhitelistPage: string[] = [BasePagePathObj.HallPage];

export const useGlobalAnnouncementModalBase = () => {
  const { t } = useTranslation();
  const hallAdModelCommandTypes = useModalLayoutStore(
    (state) => state.hallAdModelCommandTypes
  );

  const setShowGlobalAnnouncementModal = useGlobalAnnouncementStore(
    (state) => state.setShowGlobalAnnouncementModal
  );
  const setGlobalNoticeData = useGlobalAnnouncementStore(
    (state) => state.setGlobalNoticeData
  );

  // 訊息格式
  // {
  //     id: string;
  //     action: 'forward' | 'confirm' | 'cancel' | 'close';
  //     message: string;
  //   }
  const onGlobalNoticeShowAction = useCallback(
    (command: HallAdModelCommandTypes) => {
      // TODO get parameter set in zustand Store
      const parameter: {
        id?: string;
        action?: string;
        message?: string;
      } = JSON.parse(command.parameterJson || '{}');

      setGlobalNoticeData({
        title: t('Notice'), // 先給固定 'Notice'
        message: parameter.message || '',
        isShowCloseButton: false,
        isShowActionButton: false,
      });
      setShowGlobalAnnouncementModal(true);
      hallAdModelInvoker.removeCache(command.uniqueId);
    },
    []
  );

  // 使用白名單方式，可顯示全局通知的頁面[GlobalNoticeWhitelistPage]
  useEffect(() => {
    const location = useLocationStore.getState().location;
    const isPass = GlobalNoticeWhitelistPage.includes(location?.pathname || '');
    if (hallAdModelCommandTypes.type === SocketNotice.GLOBAL_NOTICE && isPass) {
      onGlobalNoticeShowAction(hallAdModelCommandTypes);
    }
  }, [hallAdModelCommandTypes]);
};

export default useGlobalAnnouncementModalBase;
