import { memo, useMemo, useRef, useState } from 'react';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { getAvatarOrder } from '@libs/commonUtils';
import LazyImage from '@components/LazyImage';
import cx from '@commonUtils/cx';
import Icon from '@components/Icon';
import { X_CENTER } from '@libs/constant/style';
import RedDot from '@components/RedDot';
import { AvatarProps } from '../AvatarProps';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';

export const Avatar = memo(
  ({
    isShowVIP = true,
    rootClassName,
    className,
    alt,
    onClick,
    isShowRedDot = false,
    isGuest,
    otherAvatarId, // 有資料， isGuest &  isShowRedDot & isShowVIP 失效
  }: AvatarProps) => {
    const avatarOrder = useUserProfileStore((state) => state.avatarOrder);
    const level = useUserProfileStore((state) => state.level);

    const [isError, setError] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const shouldShowVip = isGuest
      ? true
      : isShowVIP && level >= 0 && level < 13;

    const isOtherAvatar = otherAvatarId !== undefined;

    const avatarSrc = useMemo(() => {
      if (otherAvatarId) {
        return getImgUrl(
          EResourceLevel.V,
          `avatar_${getAvatarOrder(Number(otherAvatarId))}`
        );
      }

      return isGuest || avatarOrder === ''
        ? getImgUrl(EResourceLevel.V, 'avatar_guest')
        : getImgUrl(
            EResourceLevel.V,
            `avatar_${getAvatarOrder(Number(avatarOrder))}`
          );
    }, [avatarOrder, isGuest, otherAvatarId]);

    const commonImgClass = cx(
      cx(
        'block',
        'object-contain',
        '!w-16 !h-16',
        // 'border bg-border-b-[var(--base-1-variant4)]',
        'border bgi-border-[var(--base-1-variant3)]',
        'rounded-full',
        className
      )
    );

    return (
      <div
        ref={containerRef}
        className={cx('relative', 'w-16 h-16', rootClassName)}
      >
        <div
          className={cx(
            commonImgClass
            // '!w-16 !h-16',
            // 'border bgi-border-[var(--base-1-variant3)]',
            // 'rounded-full',
            // className
          )}
        >
          {avatarSrc !== null && !isError ? (
            <LazyImage
              ref={containerRef}
              className={'rounded-full'}
              src={avatarSrc}
              imgName={`avatar_icon_${avatarOrder}`}
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
            <BaseCacheImg
              className={'rounded-full'}
              alt={alt ? alt : `avatar_icon_${avatarOrder}`}
              src={avatarSrc || ''}
              imgName={`avatar_icon_${avatarOrder}`}
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
        </div>

        {shouldShowVip && !isOtherAvatar ? (
          <Icon
            name={`ic_vip_level_badge_${isGuest ? 0 : level}`}
            className={cx(
              'w-[60px] h-[18px]',
              'absolute bottom-[-1.5px]',
              X_CENTER
            )}
          />
        ) : null}

        {isShowRedDot && isGuest === false && !isOtherAvatar ? (
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
