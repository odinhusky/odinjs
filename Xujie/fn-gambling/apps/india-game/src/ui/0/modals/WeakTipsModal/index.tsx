export interface WeakTipsModalProps {
  isShow: boolean;
  title: string;
  content: string;
  primaryBtnText: string;
  onPrimaryBtnClick?: VoidFunction;
  secondaryBtnText: string;
  onSecondaryBtnClick?: VoidFunction;
  onClose?: VoidFunction;
  isShowClose?: boolean;
  titlePosition?: 'start' | 'center';
  isShowDivider?: boolean;
  isSingleButton?: boolean;
}

export const WeakTipsModal = ({
  isShow,
  title,
  content,
  primaryBtnText,
  onPrimaryBtnClick,
  secondaryBtnText,
  onSecondaryBtnClick,
}: WeakTipsModalProps) => {
  return null;
};

export default WeakTipsModal;
