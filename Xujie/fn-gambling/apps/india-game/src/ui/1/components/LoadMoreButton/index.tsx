import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { cx } from '@libs/commonUtils';
import { useTranslation } from 'react-i18next';

interface LoadMoreButtonProps {
  onClick: () => void;
}
export const LoadMoreButton = (props: LoadMoreButtonProps) => {
  const { t } = useTranslation();

  return (
    <BasePrimaryBtn
      className={cx('py-2 mt-3', 'box-border')}
      onClick={props.onClick}
      children={t('home_btn_load_more')}
    />
  );
};

export default LoadMoreButton;
