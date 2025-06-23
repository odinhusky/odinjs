export interface WeakTipsModalProps {
  isShow: boolean;
  title: string;
  content: string | React.ReactNode;
  primaryBtnText: string;
  onPrimaryBtnClick?: VoidFunction;
  secondaryBtnText: string;
  onSecondaryBtnClick?: VoidFunction;
  onClose?: VoidFunction;
  isShowClose?: boolean;
  titlePosition?: 'start' | 'center';
  contentPosition?: 'start' | 'center';
  isShowDivider?: boolean;
  isSingleButton?: boolean;
  buttonsContainerClassName?: string;
}
