import { memo, useMemo, useRef, useState } from 'react';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { getAvatarOrder } from '@libs/commonUtils';
import LazyImage from '@components/LazyImage';
import cx from '@commonUtils/cx';

interface AvatarProps {
  className?: string;
  alt?: string;
  onClick?: () => void;
}

export const Avatar = memo((props: AvatarProps) => {
  const avatarOrder = useUserProfileStore((state) => state.avatarOrder);
  const [isError, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarSrc = useMemo(() => {
    return avatarOrder === ''
      ? null
      : getImgUrl(
          EResourceLevel.V,
          `avatar_${getAvatarOrder(Number(avatarOrder))}`
        );
  }, [avatarOrder]);

  return (
    <div ref={containerRef}>
      {avatarSrc !== null && !isError ? (
        <LazyImage
          ref={containerRef}
          className={cx('object-contain', props.className)}
          src={avatarSrc}
          alt={props.alt ? props.alt : `avatar_icon_${avatarOrder}`}
          onClick={props.onClick}
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
          className={cx('object-contain', props.className)}
          alt={props.alt ? props.alt : `avatar_icon_${avatarOrder}`}
          src={avatarSrc || ''}
          onClick={props.onClick}
        />
      ) : (
        <div
          className={cx(
            'rounded-full object-contain bgi-[var(--transparent-gray-10)]',
            props.className
          )}
          onClick={props.onClick}
        ></div>
      )}
    </div>
  );
});

export default Avatar;
