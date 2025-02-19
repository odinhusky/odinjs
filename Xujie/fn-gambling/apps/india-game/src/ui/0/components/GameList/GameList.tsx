import { Mode2GameListConfig } from '@mode2/zustand/page/hallPageStore';
import 'swiper/css';
import 'swiper/css/pagination';

/**
 * 獲取需要顯示的遊戲列表資料
 * 在大廳時某些遊戲只需要顯示部分資料,剩餘資料需點擊“顯示更多”才會展開
 * 在遊戲類別分頁時是全部展開
 */
const getGameList = (props: Mode2GameListConfig, count: number) => {
  let data = [];
  const number = count || props?.displayCount || 0;
  if (props?.displayCount) {
    data = props!.list.slice(0, number);
  } else {
    data = props!.list;
  }

  return data;
};

export const GameList = (props: Mode2GameListConfig) => {
  return null;
};

export default GameList;
