import { useEffectOnce } from '@libs/commonUtils';
import {
  HallPageIdObj,
  useMode2HallPageTabsStore,
} from '@mode2/zustand/page/hallPageStore';

export const useHallPageGameCategoryTabsInit = () => {
  const setCurTab = useMode2HallPageTabsStore((state) => state.setCurTab);

  // V6 版本初始化為 Hot，並取消大廳的Tab
  // 不放在 GameCategoryTabs 的地方是為了避免一直被重複 render 給觸發
  useEffectOnce(() => {
    setCurTab(HallPageIdObj.HOT);
  });
};

export default useHallPageGameCategoryTabsInit;
