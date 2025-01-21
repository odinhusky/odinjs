import { memo, useMemo, useRef, useState } from 'react';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { getAvatarFrameOrder } from '@libs/commonUtils';
import LazyImage from '@components/LazyImage';
import cx from '@commonUtils/cx';

interface AvatarProps {
  className?: string;
  alt?: string;
  avatarFrameId?: string; // 頭像框ID
  onClick?: () => void;
}

export const AvatarFrame = memo((props: AvatarProps) => {
  const avatarFrameOrder = useUserProfileStore(
    (state) => state.avatarFrameOrder
  );
  const index = props.avatarFrameId || avatarFrameOrder;
  const [isError, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarFrameSrc = useMemo(() => {
    return index === ''
      ? null
      : getImgUrl(
          EResourceLevel.V,
          `avatar_frame_${getAvatarFrameOrder(Number(index))}`
        );
  }, [index]);

  return index ? (
    <div ref={containerRef}>
      {avatarFrameSrc !== null && !isError ? (
        <LazyImage
          ref={containerRef}
          className={cx('object-contain', props.className)}
          src={avatarFrameSrc}
          alt={props.alt ? props.alt : `avatar_frame_${avatarFrameSrc}`}
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
          alt={props.alt ? props.alt : `avatar_frame_${avatarFrameSrc}`}
          src={avatarFrameSrc || ''}
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
  ) : null;
});

export default AvatarFrame;
