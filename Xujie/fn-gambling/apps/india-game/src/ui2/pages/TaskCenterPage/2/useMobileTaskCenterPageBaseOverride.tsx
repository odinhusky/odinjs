import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { useLocationStore } from '@mode2/zustand/locationStore';
import { useEffect } from 'react';
import TaskCenterPageHeader from './components/TaskCenterPageHeader';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
export const useMobileTaskCenterPageBaseOverride = () => {
  const setConfig = useHeaderStore((state) => state.setConfig);
  const thisPath = BasePagePathObj.TaskCenterPage;
  const location = useLocationStore((state) => state.location);

  useEffect(() => {
    if (location?.pathname !== thisPath) {
      return;
    }

    setConfig({
      type: EHeaderType.Common,
      title: { i18nKey: 'Mission' },
      headerBgColor: 'bgi-[var(--base-2-variant5)]',
      templateBgColor: 'var(--background-middle)',
      headerBgImg: getImgUrl(EResourceLevel.V, 'casino_background'),
      render: () => {
        return <TaskCenterPageHeader />;
      },
    });
  }, [location]);
};

export default useMobileTaskCenterPageBaseOverride;
