import { memo } from 'react';

interface AvatarProps {
  className?: string;
  alt?: string;
  avatarFrameId?: string; // 頭像框ID
  onClick?: () => void;
}

export const AvatarFrame = memo((props: AvatarProps) => {
  return null;
});

export default AvatarFrame;
