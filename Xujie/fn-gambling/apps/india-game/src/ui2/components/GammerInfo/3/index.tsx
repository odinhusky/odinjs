import { useEffect, useRef, useState, AnimationEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { EResourceLevel, formatMoney, getImgUrl } from '@mode2/utils';
import cx from '@commonUtils/cx';
import './index.scss';
import { usePostPlayerBroadcastMutation } from '@mode2/external/api';
import { useGameListStore } from '@mode2/zustand/gameListStore';
import { WinGameItemResult } from '@mode2/external/api/endpoint/game/PostGameHomeEndpoint';
import { useIsShowLoginModalStore } from '@mode2/zustand/loginStore';

const AVATAR_IMG_AMOUNT = 16;
const AVATAR_RING_IMG_AMOUNT = 4;
const POPUP_DISPLAY_DURATION = 3; // 秒

/**
 * 首頁右上角玩家最新資訊Popup (頭像和頭像框隨機顯示,出現時機在顯示完後隨機調整)
 * - 玩家頭像A在遊戲B贏了C元
 * - 玩家頭像A提領了C元
 */
const GammerInfo = () => {
  const { t } = useTranslation();
  const isShowLoginModal = useIsShowLoginModalStore(
    (state) => state.isShowLoginModal
  );
  const [isShowPopup, setIsShowPopup] = useState(false);
  const curTime = useRef(0);
  const showTime = useRef(Math.floor(Math.random() * (13 - 4 + 1) + 4));

  const avatarSrcIndex = useRef(1);
  const avatarRingSrcIndex = useRef(1);
  const isVisible = useRef(false);

  const firstMounted = useRef(true);
  const gammerData = useRef<WinGameItemResult>({} as WinGameItemResult);

  const avatarSrc = getImgUrl(
    EResourceLevel.V,
    `avatar_${avatarSrcIndex.current}`
  );
  const avatarRingSrc = getImgUrl(
    EResourceLevel.V,
    `avatar_frame_${avatarRingSrcIndex.current}`
  );

  const [postPlayerBroadcast, { data: playerBroadcastData }] =
    usePostPlayerBroadcastMutation();

  const winGamesIndex = useGameListStore((state) => state.winGamesIndex);
  const setWinGameList = useGameListStore((state) => state.setWinGameList);
  const setWinGamesIndex = useGameListStore((state) => state.setWinGamesIndex);

  const gameInfoIndex = useRef(winGamesIndex);

  /**
   * 返回一個 1 到 amount 之间的隨機整數(包括amount)
   * @param amount - 圖檔總數
   * @returns 1 到 amount 之間的整數(包括amount)
   */
  const randomImgIndex = (amount: number): number => {
    return Math.floor(Math.random() * amount) + 1;
  };

  const renderMoneyString = (): string => {
    const isWinGame = gammerData.current?.type === 1;
    if (isWinGame) {
      return formatMoney({ value: gammerData.current?.amount || 0 });
    }
    return t('popup_home_win', {
      amount: formatMoney({ value: gammerData.current?.amount || 0 }),
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      curTime.current += 1;

      if (isShowPopup) {
        // popup顯示持續時間
        if (curTime.current > POPUP_DISPLAY_DURATION) {
          setIsShowPopup(false);
          curTime.current = 0;
        }
      } else {
        if (curTime.current > showTime.current) {
          firstMounted.current = false;
          avatarSrcIndex.current = randomImgIndex(AVATAR_IMG_AMOUNT);
          const winGameList = useGameListStore.getState().winGameList;
          // 從頭開始播放winGameList的內容, 放完了就先去更新winGameList之後再重新播放

          if (gameInfoIndex.current > winGameList.length - 1) {
            gameInfoIndex.current = 0;
            postPlayerBroadcast();
          }

          gammerData.current = winGameList[gameInfoIndex.current];
          gameInfoIndex.current += 1;
          setWinGamesIndex(gameInfoIndex.current);

          setIsShowPopup(gammerData.current !== undefined);
          curTime.current = 0;
          showTime.current = Math.floor(Math.random() * (13 - 4 + 1) + 4);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isShowPopup]);

  useEffect(() => {
    if (playerBroadcastData) {
      setWinGameList(playerBroadcastData);
    }
  }, [playerBroadcastData]);

  useEffect(() => {
    avatarSrcIndex.current = randomImgIndex(AVATAR_IMG_AMOUNT);
    avatarRingSrcIndex.current = randomImgIndex(AVATAR_RING_IMG_AMOUNT);
  }, []);

  const animationClassName = isShowPopup ? 'showDiv' : 'hideDiv';

  // 動畫結束後再隱藏元素
  const handleAnimationEnd = (e: AnimationEvent<HTMLDivElement>) => {
    if (e.animationName === 'hideAni') {
      isVisible.current = false;
    }
  };

  if (!isShowLoginModal && !firstMounted.current) {
    return (
      <div
        className={cx(
          'w-[134px] h-[52px]',
          'mobile:w-[148px] mobile:h-[60px]',
          'absolute z-[6]',
          'top-[48px] mobile:top-full',
          'right-[12px] mobile:right-[36px]',
          'mobile:mt-[16px]',
          animationClassName,
          {
            hidden: !isVisible,
          }
        )}
        onAnimationEnd={handleAnimationEnd}
      >
        {/* Avatar */}
        <div
          className={cx(
            'w-9 h-9',
            'absolute top-1/2 z-[5]',
            'transform -translate-y-1/2'
          )}
        >
          <img
            src={avatarSrc}
            alt="avatar"
            className={cx(
              'absolute top-0 left-0 z-[2]',
              'w-8 h-8',
              'ml-[2px] mt-[3px]'
            )}
          />
          <img
            src={avatarRingSrc}
            alt="ring"
            className={cx('absolute top-0 left-0 z-[3]', 'h-9 w-9')}
          />
        </div>

        {/* Msg info */}
        <div
          className={cx(
            'absolute right-0',
            'w-[114px] h-[52px]',
            'mobile:w-[125px] mobile:h-[60px]'
          )}
        >
          <img
            src={getImgUrl(EResourceLevel.V, `popup_winner_bg`)}
            alt="background img"
            className="h-full w-full"
          />

          {/* Gammer */}
          <div
            className={cx(
              'absolute top-1/2 left-1/2 z-[3]',
              'transform -translate-y-1/2 -translate-x-1/2',
              'w-[80px] mobile:w-[93px]'
            )}
          >
            <div
              className={cx(
                'text-xs mobile:text-sm',
                'font-medium text-white text-center whitespace-nowrap text-ellipsis',
                'overflow-hidden'
              )}
            >
              {gammerData.current?.name}
            </div>
            <div
              className={cx(
                'text-xs mobile:text-sm',
                'text-center font-semibold text-[#FE8B34]'
              )}
            >
              {renderMoneyString()}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default GammerInfo;
