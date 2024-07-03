import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { TailSpin } from 'react-loading-icons';
import { IGameItem, IItem } from './GameItem';
import styled from 'styled-components';
import { environment } from '../../../../../environments/environment';
import { GameImg } from '../GameImg';
import { FavoriteSection } from '../FavoriteSection';
import { Skeleton } from '../Skeleton';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../reduxStore';
import { useImageLoad } from '../../../hooks/useImageLoag';
import { LockIcon } from '../../../components/Lock';

const StyledMobileGameItem = styled.div.attrs<IGameItem>((props) => ({
  // className: cx("w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/5 xl:w-1/5", props.className)
  className: cx('', props.className),
}))`
  cursor: pointer;
  z-index: 1;
`;

export const MobileGameItem = (props: IItem) => {
  const [onLoad, setOnLoad] = useState(false);
  const itemRef = useRef<any>(null);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

  // const {loadImageAndCache, imageCache} = useImageLoad();
  const smallIconUrl = `${environment.s3URLImages}/${props.gameId}-small.png`;
  // 10分鐘緩存
  // const expirationSec = 60 * 10;
  // useEffect(() => {
  //   loadImageAndCache(smallIconUrl, smallIconUrl, expirationSec);
  // }, []);

  const { userFavoriteGameIds } = useSelector(
    (state: RootState) => state.userRecent
  );

  useEffect(() => {
    let observer: IntersectionObserver;

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setImageSrc(smallIconUrl);
          observer.unobserve(entry.target);
        }
      });
    };

    if (itemRef.current) {
      observer = new IntersectionObserver(handleObserver, {
        threshold: 0.01,
        rootMargin: '70%',
      });
      observer.observe(itemRef.current);
    }

    return () => {
      if (observer && itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, [smallIconUrl]);
  return (
    <StyledMobileGameItem
      ref={itemRef}
      className={cx(
        'p-1 shrink-0 grow-0 basis-[33%] overflow-hidden w-[33vw] h-[calc(33vw+11px)] rounded-2xl flex flex-col items-center relative',
        {},
        props.className
      )}
    >
      <div
        onClick={() => {
          !props.isLock && props.onClick && props.onClick();
        }}
        className={cx('relative overflow-hidden w-full h-full rounded-xl ', {})}
      >
        {!onLoad && (
          <Skeleton
            className={
              'rounded-xl w-full h-full flex justify-center items-center'
            }
          >
            <TailSpin />
          </Skeleton>
        )}

        {imageSrc && (
          <GameImg
            alt={props.name}
            // className={cx("border-[#FFFA05] border-[1px] border-solid",
            // 解決金邊缺角
            className={cx(
              'active:blur-[2px] active:brightness-50',
              props.isLock ? 'grayscale' : '',
              {
                // "van-image": isMobile,
                invisible: !onLoad,
              }
            )}
            // src={props.imageURL}
            src={imageSrc}
            srcSet={`${imageSrc} 1x, ${environment.s3URLImages}/${props.gameId}-medium.png 2x, ${environment.s3URLImages}/${props.gameId}-large.png 3x`}
            onLoad={() => {
              setOnLoad(true);
            }}
          />
        )}

        <FavoriteSection
          onClickFavorite={(event: any) => {
            event.stopPropagation();
            props.onClickFavorite && props.onClickFavorite();
          }}
          favorite={userFavoriteGameIds.includes(props.gameId)}
        />

        {props.isLock && (
          <LockIcon
            tipId={`${props.gameId}`}
            className={
              'absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]'
            }
          />
        )}
      </div>

      <div
        className={
          'text-[#d7e8ff] block text-ellipsis truncate text-xs sm:text-sm md:text-base w-full sm:text-center md:text-left'
        }
      >
        {props.name}
      </div>
    </StyledMobileGameItem>
  );
};
