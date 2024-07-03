import React, { useLayoutEffect, useRef, useState } from 'react';
import { environment } from '../../../../../../environments/environment';
import { LazyImage } from '../../../../components/image/LazyImage';

import cx from 'classnames';
import { TailSpin } from 'react-loading-icons';
import { Skeleton } from '../../GameItem/GameItem';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import { FavoriteSection } from '../../FavoriteSection';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import { PlayButton } from './PlayButton';
import { LockIcon } from '../../../../components/Lock';

export type IGameItem = {
  gameId: number;
  imageURL?: string; // ! 傳進來但沒有用到
  name: string;
  onClick?: () => void;
  onClickFavorite?: () => void;
  className?: string;
  isRecent?: boolean;
  isLock: boolean;
};

export const CellGameItem = (props: IGameItem) => {
  const {
    gameId,
    name,
    onClick,
    onClickFavorite,
    className,
    isRecent = false,
  } = props;
  const [onLoad, setOnLoad] = useState<boolean>(false);
  const [hover, setHover] = useState<boolean>(false);
  const userFavoriteGameIds = useSelector(
    (state: RootState) => state.userRecent.userFavoriteGameIds
  );
  const { isDesktop, isTablet, isMobile } = useBreakpoint();
  const containerRef = useRef<any>(null);
  const smallIconUrl = `${environment.s3URLImages}/${gameId}-small.png`;

  const playButtonClassName: string = isRecent
    ? cx('h-5 mobile:h-12')
    : cx('h-9 mobile:h-[56px]');

  const iconClassName: string = 'rounded-xl aspect-square';

  useLayoutEffect(() => {
    setOnLoad(false);
  }, [smallIconUrl]);

  return (
    <div
      className={cx(
        'cursor-pointer ',
        'flex flex-col items-center',
        'relative shrink-0',
        className
      )}
      ref={containerRef}
      onClick={() => {
        !props.isLock && onClick && onClick();
      }}
      onMouseOver={() => {
        setHover(true);
      }}
      onMouseOut={() => {
        setHover(false);
      }}
    >
      {!onLoad && !isRecent && (
        <Skeleton
          className={cx(
            iconClassName,
            'flex justify-center items-center w-full'
          )}
        >
          <TailSpin />
        </Skeleton>
      )}

      <div
        className={cx(iconClassName, 'items-center', {
          'absolute top-1/2 -translate-y-1/2  left-1/2 -translate-x-1/2':
            !onLoad,
        })}
      >
        <div className={cx('relative flex flex-col ')}>
          {/* game icon */}
          <LazyImage
            ref={containerRef}
            alt={'name'}
            className={cx(
              iconClassName,
              'w-full object-cover ',
              props.isLock ? 'grayscale' : '',
              {
                'blur-[1px] brightness-75': hover,
                hidden: !onLoad,
                'basis-[calc(100%-1rem)]': onLoad,
              }
            )}
            src={smallIconUrl}
            onLoad={() => {
              setOnLoad(true);
            }}
          />

          {/* hover border */}
          {hover && (
            <div
              className={cx(
                iconClassName,
                'absolute h-full w-full',
                'border-2 border-[var(--grayscale-60)]',
                'shadow-[_inset_0px_-8px_8px_0px_rgba(0,_0,_0,_0.3)]'
              )}
            />
          )}

          {/* play button */}
          {hover && isDesktop && !props.isLock && (
            <PlayButton
              onClick={() => {
                !props.isLock && onClick && onClick();
              }}
              className={playButtonClassName}
            />
          )}

          {props.isLock && (
            <LockIcon
              tipId={`${props.gameId}`}
              className={
                'absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]'
              }
            />
          )}
        </div>
      </div>

      {/* favorite button */}
      {!isRecent && (
        <div
          className={cx(
            'block truncate w-full shrink-0',
            'text-left text-[var(--grayscale-100)] text-sm mobile:text-base font-medium text-ellipsis'
          )}
        >
          {name}
        </div>
      )}

      {!isDesktop && !isRecent && (
        <FavoriteSection
          onClickFavorite={(event: any) => {
            event.stopPropagation();
            onClickFavorite && onClickFavorite();
          }}
          favorite={userFavoriteGameIds.includes(gameId)}
        />
      )}

      {isDesktop &&
        !isRecent &&
        (userFavoriteGameIds.includes(gameId) || hover) && (
          <FavoriteSection
            onClickFavorite={(event: any) => {
              event.stopPropagation();
              onClickFavorite && onClickFavorite();
            }}
            favorite={userFavoriteGameIds.includes(gameId)}
          />
        )}
    </div>
  );
};
