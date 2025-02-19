import { FloatActionButton as FloatActionButtonObj } from '@mode2/zustand/components/floatActionButtonStore';

export const ActionButton = ({
  item,
  styles,
  imageClassName,
  imgType = '',
  onAnimationEnd = () => {},
}: {
  item: FloatActionButtonObj;
  styles?: React.CSSProperties;
  imageClassName?: string;
  imgType?: string;
  onAnimationEnd?: () => void;
}) => {
  return null;
};

export default ActionButton;
