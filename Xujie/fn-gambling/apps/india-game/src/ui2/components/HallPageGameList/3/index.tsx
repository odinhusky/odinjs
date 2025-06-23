import GameList from '@components/GameList';
import { useMode2HallPageGameListStore } from '@mode2/zustand/page/hallPageStore';
import isEmpty from 'lodash/isEmpty';
import { Element } from 'react-scroll';

export const HallPageGameList = () => {
  const gameList = useMode2HallPageGameListStore((state) => state.gameList);

  return (
    <div className="flex-1 min-w-0">
      {/* 動態產生不同的類別的遊戲 */}
      {/* 沒資料就不顯示 */}

      {gameList.map((item, index, arr) => {
        return isEmpty(item.list) ? null : (
          <Element name={`${item.tabId}`} key={item.iconName}>
            <GameList
              isLastConfig={arr.length - 1 === index}
              isSupplierGameList={false}
              key={item.iconName}
              {...item}
            />
          </Element>
        );
      })}
    </div>
  );
};

export default HallPageGameList;
