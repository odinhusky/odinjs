import GameList from '@components/GameList/GameList';
import { useMode2HallPageGameListStore } from '@mode2/zustand/page/hallPageStore';
import { isEmpty } from 'lodash';

export const HallPageGameList = () => {
  const gameList = useMode2HallPageGameListStore((state) => state.gameList);
  const platformList = useMode2HallPageGameListStore(
    (state) => state.platformList
  );

  return (
    <>
      {/* 動態產生不同的類別的遊戲 */}
      {/* 沒資料就不顯示 */}
      {gameList.map((item) => {
        return isEmpty(item.list) ? null : (
          <GameList isSupplierGameList={false} key={item.iconName} {...item} />
        );
      })}

      {/* 顯示供應商列表 */}
      {platformList.map((item) => (
        <GameList isSupplierGameList={true} key={item.iconName} {...item} />
      ))}
    </>
  );
};

export default HallPageGameList;
