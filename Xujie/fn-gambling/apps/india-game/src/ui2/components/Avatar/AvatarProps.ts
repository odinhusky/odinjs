export interface AvatarProps {
  rootClassName?: string;
  className?: string;
  isShowVIP?: boolean;
  alt?: string;
  onClick?: () => void;
  // Avatar 3 的 props
  isShowRedDot?: boolean;
  // isShowVIP?: boolean;
  isGuest?: boolean;
  otherAvatarId?: string | number;
}
