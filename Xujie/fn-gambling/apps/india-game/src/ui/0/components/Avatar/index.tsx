import { memo } from 'react';

interface AvatarProps {
  className?: string;
  alt?: string;
  onClick?: () => void;
}

export const Avatar = memo((props: AvatarProps) => {
  return null;
});

export default Avatar;
