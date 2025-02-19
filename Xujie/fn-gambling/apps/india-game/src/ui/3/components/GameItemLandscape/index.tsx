import { MouseEvent, useRef, useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import './index.scss';
import cx from '@commonUtils/cx';
import {
  GameListItemResult,
  EnterGameType,
} from '@mode2/zustand/page/hallPageStore';
import { useGameListStore } from '@mode2/zustand/gameListStore';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { useIsLoginStore } from '@mode2/zustand/loginStore';
import LazyImage from '@components/LazyImage';
import { useGameItemBase } from '@mode2/usecase/useGameItemBase';
import { FLEX_CENTER, FLEX_COL } from '@libs/constant/style';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import Icon from '@components/Icon';
// import { useMoreGamePageStoreStore } from '@libs/mode2/zustand/page/moreGamePage';

interface GameItemProps {
  item: GameListItemResult;
  showGameName: boolean; // 整個game list 的item是否要顯示name
  isShowHoverMask: boolean;
  imageClassName?: string;
}

/** casino遊戲圖片失效時要顯示的遊戲廠商logo */
const GameSupplierLogo = ({ logoSrc }: { logoSrc: string }) => {
  return (
    <div className="absolute left-0 bottom-0 h-[29%] w-[22%] ml-[2%]">
      <img src={logoSrc} alt="Game Supplier" />
    </div>
  );
};

export const GameItemLandscape = memo((props: GameItemProps) => {
  const { navToLoginPage } = useNavPageClick();
  const { item, showGameName, isShowHoverMask } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { onEnterGame, onCollect, isShowName } = useGameItemBase();

  // const favoriteGameIds = useGameListStore((state) => state.favoriteGameIds);

  // const addRecentGameList = useMoreGamePageStoreStore(
  //   (state) => state.addRecentGameList
  // );

  const isLogin = useIsLoginStore((state) => state.isLogin);

  const [hover, setHover] = useState(false);

  const [isLoadError, setLoadError] = useState(false);

  const displayName = item.name || item.platform || item.gameName;
  const hasGameId = item.gameId !== undefined;

  // 只有直接進入遊戲的item才能被加入最愛
  // const canAddToFavorites =
  //   hasGameId && item.enterGameType === EnterGameType.DIRECT;
  const shouldShowGameName = isShowName(item, showGameName);

  // 只有會直接進入的遊戲才需要顯示hot字樣
  const shouldShowHotGameText =
    item.isHotGame &&
    item.enterGameType === EnterGameType.DIRECT &&
    !!item?.coverImageSrc?.length;

  // TODO 判斷什麼時候出現 New 的標籤
  const shouldShowNewGameText =
    item.isNewGame && shouldShowHotGameText === false;

  // const isFavorite = favoriteGameIds.includes(item.gameId);

  // const favoriteImgUrl = getImgUrl(
  //   EResourceLevel.V,
  //   `btn_favorite_${isFavorite ? 'active' : 'unactive'}`
  // );

  // const handleAddToFavoriteClick = (e: MouseEvent<HTMLDivElement>) => {
  //   e.stopPropagation();
  //   if (isLogin) {
  //     // - 因為不會根據 加入/移除 我的最愛，就去重打所有的GameList API，所以透過這種方式改寫現在最真實我的最愛的狀態
  //     const newItem = {
  //       ...item,
  //       isFavorite,
  //     };

  //     onCollect(newItem);
  //   } else {
  //     navToLoginPage(59, true);
  //   }
  // };

  /** 除了點擊後進入遊戲目錄的item之外,都需要先登入 */
  const handleEnterGameClick = () => {
    // 維修中禁止點擊
    if (!item.isMaintain) {
      if (item.enterGameType !== EnterGameType.DIRECTORY && !isLogin) {
        navToLoginPage(58, true);
      } else {
        onEnterGame(item);

        // 加入到 recent 的列表
        // addRecentGameList(item);
      }
    }
  };

  const handleImageLoadOnError = () => {
    setLoadError(true);
  };

  const renderFallBackImage = () => {
    const fallbackImg = getImgUrl(
      EResourceLevel.V,
      'game_item_cover_landscape_fallback'
    );

    return (
      <img
        src={fallbackImg}
        alt="Fallback"
        className={cx('absolute rounded-lg w-full h-full object-cover')}
      />
    );
  };

  return (
    <div
      className={cx('relative', FLEX_COL, 'h-full w-full', {
        'cursor-default pointer-event-none': item.isMaintain,
        'cursor-pointer': !item.isMaintain,
      })}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      onClick={handleEnterGameClick}
      ref={containerRef}
    >
      <div className={cx('relative', props.imageClassName)}>
        {/** 使用”h-full w-full object-cover“確保圖片是等比例縮放, 並自動裁減掉超出部分 */}
        {isLoadError ? (
          renderFallBackImage()
        ) : (
          <LazyImage
            src={item.coverImageSrc}
            className={cx('absolute rounded-lg w-full h-full object-cover')}
            ref={containerRef}
            onError={() => {
              handleImageLoadOnError();
            }}
          />
        )}

        {/* casino橫向圖片載入失效 廠商logo */}
        {isLoadError && !item.isMaintain && (
          <GameSupplierLogo logoSrc={item.manufacturerLogoUrl} />
        )}

        {shouldShowHotGameText && (
          <div
            className={cx(
              'w-10 h-[14px]',
              FLEX_CENTER,
              'absolute top-1 left-1'
            )}
          >
            <Icon name="ic_hot_badge" className="w-full h-full" />
          </div>
        )}

        {!shouldShowHotGameText && shouldShowNewGameText ? (
          <div
            className={cx(
              'w-10 h-[14px]',
              FLEX_CENTER,
              'absolute top-1 left-1'
            )}
          >
            <Icon name="ic_new_badge" className="w-full h-full" />
          </div>
        ) : null}

        {/* {canAddToFavorites && !item.isMaintain && (
          <div
            className={cx(
              'w-8 h-11 absolute top-0 right-3 z-20 cursor-pointer'
            )}
            onMouseOver={(e) => e.stopPropagation()}
            onClick={(e) => handleAddToFavoriteClick(e)}
          >
            <img src={favoriteImgUrl} alt="collect" />
          </div>
        )} */}

        {((isShowHoverMask && hover) || item.isMaintain) && (
          <>
            <div className="bg-hover rounded-lg"></div>
            <div
              className={cx(
                'bgi-text-[var(--grayscale-100)]',
                'w-full h-full',
                'absolute left-0 top-0 z-10',
                FLEX_CENTER,
                'box-border',
                'text-sm mobile:text-base',
                'font-medium text-center'
              )}
            >
              {item.isMaintain ? (
                <div className="flex flex-col justify-center items-center p-1">
                  <Icon
                    className={cx(
                      'w-[72px] h-[72px] mobile:w-[72px] mobile:h-[72px] mb-1'
                    )}
                    name="game_card_maintenance"
                  />
                  <div>
                    {item.maintainTime !== ''
                      ? item.maintainTime
                      : t('maintenance')}
                  </div>
                </div>
              ) : (
                displayName
              )}
            </div>
          </>
        )}
      </div>

      {shouldShowGameName && (
        <div
          className={cx(
            'bgi-text-[var(--grayscale-100)]',
            'mt-1 mobile:mt-2',
            'text-sm mobile:text-base',
            'font-medium text-center',
            'text-ellipsis whitespace-nowrap',
            'overflow-hidden',
            'shrink-0'
          )}
        >
          {displayName}
        </div>
      )}
    </div>
  );
});

export default GameItemLandscape;
