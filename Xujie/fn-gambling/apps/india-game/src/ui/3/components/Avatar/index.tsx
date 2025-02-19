import { memo, useMemo, useRef, useState } from 'react';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { getAvatarOrder } from '@libs/commonUtils';
import LazyImage from '@components/LazyImage';
import cx from '@commonUtils/cx';
import { useMyPageStore } from '@libs/mode2/zustand/page/myPageStore';
import Icon from '@components/Icon';
import { X_CENTER } from '@libs/constant/style';
import RedDot from '@components/RedDot';
import { AvatarProps } from '@components/Avatar';

export const Avatar = memo(
  ({
    isShowVIP = true,
    rootClassName,
    className,
    alt,
    onClick,
    isShowRedDot = false,
    isGuest,
  }: AvatarProps) => {
    const avatarOrder = useUserProfileStore((state) => state.avatarOrder);
    const [isError, setError] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const vipLevel = useMyPageStore((state) => state.vipLevel);

    const shouldShowVip = isGuest
      ? true
      : isShowVIP && vipLevel >= 0 && vipLevel < 13;

    const avatarSrc = useMemo(() => {
      return isGuest || avatarOrder === ''
        ? getImgUrl(EResourceLevel.V, 'avatar_guest')
        : getImgUrl(
            EResourceLevel.V,
            `avatar_${getAvatarOrder(Number(avatarOrder))}`
          );
    }, [avatarOrder, isGuest]);

    const commonImgClass = cx(
      cx(
        'block',
        'object-contain',
        '!w-16 !h-16',
        'border bg-border-b-[var(--base-1-variant4)]',
        'rounded-full',
        className
      )
    );

    return (
      <div
        ref={containerRef}
        className={cx('relative', 'w-16 h-16', rootClassName)}
      >
        {avatarSrc !== null && !isError ? (
          <LazyImage
            ref={containerRef}
            className={commonImgClass}
            src={avatarSrc}
            alt={alt ? alt : `avatar_icon_${avatarOrder}`}
            onClick={onClick}
            onLoad={() => {
              setError(false);
            }}
            onError={(e) => {
              setError(true);
              console.log('@@@====> error', e);
            }}
          />
        ) : isError ? (
          <img
            className={commonImgClass}
            alt={alt ? alt : `avatar_icon_${avatarOrder}`}
            src={avatarSrc || ''}
            onClick={onClick}
          />
        ) : (
          <div
            className={cx(
              'rounded-full object-contain bgi-[var(--transparent-gray-10)]',
              className
            )}
            onClick={onClick}
          ></div>
        )}

        {shouldShowVip ? (
          <Icon
            name={`ic_vip_level_badge_${isGuest ? 0 : vipLevel}`}
            className={cx(
              'w-[60px] h-[18px]',
              'absolute bottom-[-1.5px]',
              X_CENTER
            )}
          />
        ) : null}

        {isShowRedDot && isGuest === false ? (
          <RedDot
            className={cx(
              'w-[0.375rem] h-[0.375rem]',
              'absolute top-1 right-1'
            )}
          />
        ) : null}
      </div>
    );
  }
);

export default Avatar;
