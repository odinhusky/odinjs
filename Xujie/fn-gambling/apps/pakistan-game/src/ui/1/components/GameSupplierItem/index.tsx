import { useRef, useState, memo } from 'react';
import cx from '@commonUtils/cx';
import {
  GameListItemResult,
  EnterGameType,
} from '@mode2/zustand/page/hallPageStore';
import {
  useIsLoginStore,
  useIsShowLoginModalStore,
} from '@mode2/zustand/loginStore';
import LazyImage from '@components/LazyImage';
import { useGameItemBase } from '@mode2/usecase/useGameItemBase';
import { FLEX_COL } from '@libs/constant/style';
import defaultFallbackImg from '@constant/fallbackBase64';
import { useBreakPoint } from '@libs/commonUtils';

interface GameItemProps {
  item: GameListItemResult;
}

/** 遊戲供應商Item */
export const GameSupplierItem = memo((props: GameItemProps) => {
  const { isMobile } = useBreakPoint();
  const { item } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const { onEnterGame } = useGameItemBase();

  const isLogin = useIsLoginStore((state) => state.isLogin);

  const [isLoadError, setLoadError] = useState(false);

  const setIsShowLoginModal = useIsShowLoginModalStore(
    (state) => state.setIsShowLoginModal
  );

  /** 除了點擊後進入遊戲目錄的item之外,都需要先登入 */
  const handleEnterGameClick = () => {
    // 維修中禁止點擊
    if (!item.isMaintain) {
      if (item.enterGameType !== EnterGameType.DIRECTORY && !isLogin) {
        setIsShowLoginModal(true);
      } else {
        onEnterGame(item);
      }
    }
  };

  const handleImageLoadOnError = () => {
    setLoadError(true);
  };

  const renderFallBackImage = () => {
    const fallbackImg = defaultFallbackImg;
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
      className={cx('relative', FLEX_COL, 'h-full w-full cursor-pointer', {
        'bgi-[var(--grayscale-00)] rounded-lg': isMobile
      })}
      onClick={handleEnterGameClick}
      ref={containerRef}
    >
      {/* 根據figma套用固定的圖片寬高比 */}
      {/* 避免後端傳來的圖片大小不一，在列表中顯示時樣式不一致 */}
      <div className={cx('relative', 'aspect-[1.791]')}>
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
      </div>
    </div>
  );
});

export default GameSupplierItem;
