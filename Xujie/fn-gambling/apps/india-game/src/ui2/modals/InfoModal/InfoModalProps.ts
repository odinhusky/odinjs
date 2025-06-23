export interface InfoModalProps {
  isShow: boolean;
  title?: string;
  titleClassName?: string;
  content?: string;
  contentClassName?: string;
  imgClassName?: string;
  confirmBtnText?: string;
  onConfirmClick?: () => void;
}
