import 'swiper/css';
import 'swiper/css/pagination';
import { PayActivationResult } from '@mode2API/endpoint/wallet/PostPayConfigInfoWithOptionsEndpoint';

const paginationSetting = {
  clickable: true,
  renderBullet: (index: number, className: string) => {
    return `<span class="${className} !w-1 !h-1 !rounded-full mt-10"></span>`;
  },
};

const TutorialModal = ({
  type,
  onClose,
}: {
  type: PayActivationResult;
  onClose?: () => void;
}) => {
  return null;
};
export default TutorialModal;
