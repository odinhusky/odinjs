import React, { useState, CSSProperties, useRef, useLayoutEffect } from 'react';
import { environment } from '../../../../../../environments/environment';
import { LazyImage } from '../../../../components/image/LazyImage';

import cx from 'classnames';
import { TailSpin } from 'react-loading-icons';
import { Skeleton } from '../../GameItem/GameItem';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import { FavoriteSection } from '../../FavoriteSection';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import { CacheImage } from '../../../../components/image/CacheImage';
import { LockIcon } from '../../../../components/Lock';

export type IGameItem = {
  gameId: number;
  imageURL: string; // ! 傳進來但沒有用到
  name: string;
  onClick?: () => void;
  onClickFavorite?: () => void;
  // favorite?: boolean
  className?: string;
  isLock: boolean;
};

export const CellGameItem = (props: IGameItem) => {
  const [onLoad, setOnLoad] = useState(false);
  const [hover, setHover] = useState(false);
  const userFavoriteGameIds = useSelector(
    (state: RootState) => state.userRecent.userFavoriteGameIds
  );
  const { isDesktop } = useBreakpoint();

  // const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const containerRef = useRef<any>(null);
  const smallIconUrl = `${environment.s3URLImages}/${props.gameId}-small.png`;

  useLayoutEffect(() => {
    setOnLoad(false);
  }, [smallIconUrl]);

  return (
    <div
      className={cx(
        'cursor-pointer ',
        'flex flex-col items-center',
        'relative group shrink-0'
      )}
      ref={containerRef}
      onClick={() => {
        !props.isLock && props.onClick && props.onClick();
      }}
      onMouseOver={() => {
        setHover(true);
      }}
      onMouseOut={() => {
        setHover(false);
      }}
    >
      {!onLoad && (
        <Skeleton
          className={cx(
            'rounded-xl flex justify-center items-center aspect-square',
            'w-full h-[calc(100%-20px)] !min-h-36 '
          )}
        >
          <TailSpin />
        </Skeleton>
      )}

      <button className={cx('rounded-xl')}>
        <div className={cx('relative flex flex-col')}>
          <LazyImage
            ref={containerRef}
            alt={'name'}
            className={cx(
              'w-full h-[calc(100%-20px)] !min-h-36',
              'rounded-xl hover:brightness-50 object-cover group-hover:brightness-50',
              'hover:blur-[0.5px] group-hover:blur-[0.5px]',
              props.isLock ? 'grayscale' : '',
              // 'hover:blur-[2px] ',
              {
                hidden: !onLoad,
                // "invisible": !onLoad,
                'basis-[calc(100%-1rem)]': onLoad,
              }
            )}
            src={smallIconUrl}
            onLoad={() => {
              setOnLoad(true);
            }}
          />

          <div
            className={cx(
              'rounded-xl absolute h-full w-full',
              'shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_1.0),_inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.4),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.4)]'
            )}
          />

          {hover && (
            <div
              className={cx(
                'rounded-xl absolute h-full w-full border-2 border-[var(--grayscale-100)]'
              )}
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
      </button>
      <div
        className={cx(
          'text-[var(--grayscale-80)] block text-ellipsis truncate w-full text-center shrink-0',
          'text-sm md:text-base mt-1 md:mt-0',
          {
            'font-bold': hover,
          }
        )}
      >
        {props.name}
      </div>

      {!isDesktop && (
        <FavoriteSection
          onClickFavorite={(event: any) => {
            event.stopPropagation();
            props.onClickFavorite && props.onClickFavorite();
          }}
          favorite={userFavoriteGameIds.includes(props.gameId)}
        />
      )}

      {isDesktop && (userFavoriteGameIds.includes(props.gameId) || hover) && (
        <FavoriteSection
          onClickFavorite={(event: any) => {
            event.stopPropagation();
            props.onClickFavorite && props.onClickFavorite();
          }}
          favorite={userFavoriteGameIds.includes(props.gameId)}
        />
      )}
    </div>
  );
};

interface ILeaderGameItem {
  gameTypeName: string;
  onClick?: () => void;
  isType?: boolean;
  style?: CSSProperties | undefined;
  isShowMore?: boolean;
}

export const CellLeaderGameItem = (props: ILeaderGameItem) => {
  const [hover, setHover] = useState(false);
  const [onLoad, setOnLoad] = useState(false);

  const isShowMoreBtn =
    typeof props?.isShowMore === 'boolean' ? props?.isShowMore : true;

  const imgSrc = props?.isType
    ? `assets/${environment.uVersion}/shared/${
        props.gameTypeName.split('-')[0]
      }-logo.png`
    : `assets/${environment.uVersion}/${
        environment.mVersion
      }/icon_${props.gameTypeName.toLowerCase()}.png`;
  return (
    <div
      className={cx(
        'rounded-xl aspect-square justify-content',
        'bg-[var(--grayscale-20)]',
        'flex flex-col mb-6',
        'relative group shrink-0 w-full h-[calc(100%-20px)] !min-h-36'
      )}
      onMouseOver={() => {
        setHover(true);
      }}
      onMouseOut={() => {
        setHover(false);
      }}
    >
      <div
        className={cx(
          'relative flex flex-col justify-center h-full items-center',
          'text-[var(--grayscale-80)] text-center shrink-0 text-xs md:text-sm'
        )}
      >
        <CacheImage
          alt={`${props.gameTypeName}`}
          className={cx('w-8 h-8 sm:w-10 sm:h-10 !min-h-36', {
            hidden: !onLoad,
          })}
          style={props?.style}
          src={imgSrc}
          onLoad={() => {
            setOnLoad(true);
          }}
        />

        <div
          className={cx(
            'text-[var(--grayscale-80)] block text-ellipsis truncate w-full text-center shrink-0',
            'text-xs md:text-sm mt-1 md:mt-0'
          )}
        >
          {props.gameTypeName}
        </div>

        {isShowMoreBtn ? (
          <button
            className={cx(
              'text-[var(--grayscale-100)] text-xs leading-5',
              'rounded-full py-1.5 px-4 mt-3',
              'flex flex-row justify-center items-center',
              'bg-[var(--grayscale-30)] border border-[var(--grayscale-70)]',
              'hover:bg-[var(--grayscale-40)]',
              'active:bg-[var(--grayscale-20)]'
            )}
            onClick={props.onClick}
          >
            {'Ver tudos'}
          </button>
        ) : null}
      </div>
    </div>
  );
};
