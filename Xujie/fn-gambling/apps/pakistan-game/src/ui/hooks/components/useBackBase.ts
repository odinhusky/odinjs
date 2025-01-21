import sdkUtils from '@mode2/utils/sdk';
import { useNavigateClick } from '@mode2/usecase/useNavPageClick';

const useBackBase = () => {
  const backText = 'leftnav_back';
  const navigate = useNavigateClick();
  const handleBack = () => {
    sdkUtils.playSound();
    navigate(-1);
  };
  return {
    backText,
    handleBack,
  };
};
export default useBackBase;
