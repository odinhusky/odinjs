export type ITabBar = {
  isShowMenu?: boolean;
  isShowHome?: boolean;
  isShowSlot?: boolean;
  isShowActivity?: boolean;
  isShowInvite?: boolean;
  isShowVIP?: boolean;
  isShowProfile?: boolean;
  size?: "big" | "small";
  className?: string;
  isShowMenuDrawer?: boolean;
  onMenuClick?: () => void
}
