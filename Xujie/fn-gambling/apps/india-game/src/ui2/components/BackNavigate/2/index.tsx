import { useBreakPoint } from '@libs/commonUtils';
import useBackBase from '@/ui/hooks/components/useBackBase';
import cx from '@commonUtils/cx';
import { useTranslation } from 'react-i18next';
import Icon from '@components/Icon';
import { BackNavigateProps } from '../BackNavigateProps';

const BackNavigate = (props: BackNavigateProps) => {
  const { t } = useTranslation();
  const { handleBack, backText } = useBackBase();
  const { isDesktop } = useBreakPoint();
  return isDesktop ? (
    <button
      className={cx(
        'back-button text-white text-xl font-medium flex items-center gap-2',
        props.className
      )}
      onClick={props.onBack || handleBack}
    >
      <Icon className="w-6 h-6" name="ic_arrow_left_1" />
      {props.title || t(backText)}
    </button>
  ) : (
    <></>
  );
};
export default BackNavigate;
