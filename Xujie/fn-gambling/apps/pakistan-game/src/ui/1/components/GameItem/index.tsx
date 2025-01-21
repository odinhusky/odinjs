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
import isEqual from 'lodash/isEqual';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import Icon from '@libs/mode2/components/Icon';

interface GameItemProps {
  item: GameListItemResult;
  showGameName: boolean; // 整個game list 的item是否要顯示name
  isShowHoverMask: boolean;
  imageClassName?: string;
}

/**
 * 遊戲圖片失效的浮水印
 */
const LoadErrorWatermark = memo(
  (props: { isDisplay: boolean; displayName: string; isMaintain: boolean }) => {
    const getDisplayInitials = (displayName: string) => {
      // 過濾空字串
      const words = displayName.split(' ').filter((word) => word.trim() !== '');
      // 提取首字母，缺失時補空字串
      const initials = words.map((word) => word[0]?.toUpperCase() || '');
      // 返回已有的首字母組合
      return initials.slice(0, 2).join('');
    };

    return props.isDisplay ? (
      <div
        className={cx(
          'absolute h-full w-full p-1 mobile:p-2 flex flex-col justify-between',
          'top-0 left-0 right-0 bottom-0'
        )}
      >
        <p
          className={cx(
            'text-right font-bold w-[70%] self-end',
            'bgi-text-[var(--transparent-white-20)]'
          )}
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.75rem)',
            lineHeight: '100%',
          }}
        >
          {getDisplayInitials(props.displayName)}
        </p>

        {!props.isMaintain ? (
          <p
            className={cx(
              'content-center',
              'text-wrap uppercase',
              'font-none ',
              'bgi-text-[var(--grayscale-100)]',
              'font-medium text-center',
              'text-sm mobile:text-base',
              'line-clamp-3'
            )}
          >
            {props.displayName}
          </p>
        ) : null}
      </div>
    ) : null;
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);

export const GameItem = memo((props: GameItemProps) => {
  const { navToLoginPage } = useNavPageClick();
  const { item, showGameName, isShowHoverMask } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { onEnterGame, onCollect, isShowName } = useGameItemBase();

  const favoriteGameIds = useGameListStore((state) => state.favoriteGameIds);

  const isLogin = useIsLoginStore((state) => state.isLogin);

  const [hover, setHover] = useState(false);

  const [isLoadError, setLoadError] = useState(false);

  const displayName = item.name || item.platform || item.gameName;
  const hasGameId = item.gameId !== undefined;

  // 只有直接進入遊戲的item才能被加入最愛
  const canAddToFavorites =
    hasGameId && item.enterGameType === EnterGameType.DIRECT;
  const shouldShowGameName = isShowName(item, showGameName);

  // 只有會直接進入的遊戲才需要顯示hot字樣
  const shouldShowHotGameText =
    item.isHotGame &&
    item.enterGameType === EnterGameType.DIRECT &&
    !!item?.coverImageSrc?.length;

  const isFavorite = favoriteGameIds.includes(item.gameId);

  const handleAddToFavoriteClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isLogin) {
      // - 因為不會根據 加入/移除 我的最愛，就去重打所有的GameList API，所以透過這種方式改寫現在最真實我的最愛的狀態
      const newItem = {
        ...item,
        isFavorite,
      };

      onCollect(newItem);
    } else {
      navToLoginPage(true);
    }
  };

  /** 除了點擊後進入遊戲目錄的item之外,都需要先登入 */
  const handleEnterGameClick = () => {
    // 維修中禁止點擊
    if (!item.isMaintain) {
      if (item.enterGameType !== EnterGameType.DIRECTORY && !isLogin) {
        navToLoginPage(true);
      } else {
        onEnterGame(item);
      }
    }
  };

  const handleImageLoadOnError = () => {
    setLoadError(true);
  };

  const renderFallBackImage = () => {
    const fallbackImg = getImgUrl(EResourceLevel.V, 'game_item_cover_fallback');

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
      <div className={cx('group relative', props.imageClassName)}>
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

        {/* 圖片載入失效 浮水印 */}
        <LoadErrorWatermark
          isDisplay={isLoadError}
          displayName={displayName}
          isMaintain={item.isMaintain}
        />

        {shouldShowHotGameText && (
          <img
            className="absolute mobile:w-[52px] mobile:h-6 w-10 h-4 top-[0.5px] left-0"
            src={getImgUrl(EResourceLevel.V, 'hot_label')}
            alt="hot"
          />
        )}

        {canAddToFavorites && !item.isMaintain && (
          <div
            className={cx('w-8 h-8 absolute top-2 right-2 z-20 cursor-pointer')}
            onMouseOver={(e) => e.stopPropagation()}
            onClick={(e) => handleAddToFavoriteClick(e)}
          >
            <div className="w-full h-full bgi-[var(--transparent-white-50)] rounded-lg">
              <img
                className={cx({
                  'opacity-100': isFavorite,
                  'opacity-50': !isFavorite,
                })}
                src={getImgUrl(EResourceLevel.V, 'ic_favorite')}
                alt="collect"
                color={'var(--grayscale-00)'}
              />
            </div>
          </div>
        )}

        {((isShowHoverMask && hover) || item.isMaintain) && (
          <>
            <div className="absolute left-0 top-0 w-full h-full bgi-[var(--linear-1)] rounded-lg z-[2]" />
            {!item.isMaintain ? (
              <div
                className="absolute left-0 top-0 w-full h-full 
                  bgi-[var(--transparent-gray-30)] rounded-lg z-[2] group-active:block hidden"
              />
            ) : null}
            <div
              className={cx(
                'bgi-text-[var(--linear-2)]',
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
                      'w-12 h-12 mobile:w-[72px] mobile:h-[72px] mb-1'
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
            'bgi-text-[var(--grayscale-90)]',
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

export default GameItem;
