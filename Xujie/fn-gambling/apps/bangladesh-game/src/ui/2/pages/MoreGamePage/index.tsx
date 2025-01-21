import { useBreakPoint } from '@libs/commonUtils';
import GameItem from '@components/GameItem';
import cx from '@commonUtils/cx';
import useMode2MoreGamePageBase from '@/ui/hooks/pages/moreGamePage/useMode2MoreGamePageBase';
import {
  useMoreGamePageRefsStore,
  useMoreGamePageStoreStore,
} from '@mode2/zustand/page/moreGamePage';
import useMoreGamePageActions from '@mode2/action/moreGameaction/useMoreGamePageActions';
import { handleMoreGamePageScroll } from '@mode2/action/moreGameaction/acitonType';
import { memo } from 'react';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import Banner from '@components/Banner';
import useBannerListBase from '@mode2/usecase/components/useBannerListBase';

const DesktopGameLogo = memo(() => {
  const { isDesktop } = useBreakPoint();
  const manufacturer = useMoreGamePageStoreStore((state) => state.manufacturer);
  const manufacturerLogoUrl = useMoreGamePageStoreStore(
    (state) => state.manufacturerLogoUrl
  );
  const moreGameLogo = getImgUrl(
    EResourceLevel.SHARED,
    `manufacturer/logo_${manufacturer.toLowerCase()}`
  );
  return isDesktop ? (
    <img
      src={manufacturerLogoUrl || moreGameLogo}
      className={cx('h-9 max-h-9 mb-5')}
      alt="game-logo"
    />
  ) : null;
});
const MoreGamePage = () => {
  useMode2MoreGamePageBase();
  useBannerListBase();

  const { isTablet, isDesktop, isMobile } = useBreakPoint();

  const gridItemClass = isDesktop
    ? 'grid-cols-6 '
    : isTablet
    ? 'grid-cols-4'
    : 'grid-cols-3';

  // 根據不同裝置定義的col數量平分寬度後,再透過統一的寬高比計算高度維持圖片比例
  const normalGameImgAspectClass = 'aspect-[0.713] object-contain';

  const moreGamePageContainerRef = useMoreGamePageRefsStore(
    (state) => state.moreGamePageContainerRef
  );

  const moreGameList = useMoreGamePageStoreStore((state) => state.moreGameList);

  const { handleMoreGamePageAction } = useMoreGamePageActions();

  return (
    <div
      className={cx({
        'pt-8': isDesktop,
        'pt-5': isTablet,
        'pt-3': isMobile,
      })}
    >
      {isDesktop ? <Banner /> : null}

      <DesktopGameLogo />

      <div
        ref={moreGamePageContainerRef}
        className={cx(
          'grid gap-4 overflow-y-scroll pb-16 mobile:pb-25 tablet:pb-16 auto-rows-max',
          gridItemClass,
          {
            'h-[90vh]': isDesktop,
            'h-[95vh]': !isDesktop,
          }
        )}
        onScroll={() => {
          handleMoreGamePageAction({
            actionName: handleMoreGamePageScroll,
          });
        }}
      >
        {moreGameList
          ? moreGameList.map((item, index: number) => {
              return (
                <GameItem
                  key={index}
                  item={item}
                  showGameName={true}
                  isShowHoverMask={true}
                  imageClassName={normalGameImgAspectClass}
                />
              );
            })
          : null}
      </div>
    </div>
  );
};
export default MoreGamePage;
