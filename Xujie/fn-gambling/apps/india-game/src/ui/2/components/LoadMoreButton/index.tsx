import Icon from '@components/Icon';
import { useTranslation } from 'react-i18next';

interface LoadMoreButtonProps {
  onClick: () => void;
}
export const LoadMoreButton = (props: LoadMoreButtonProps) => {
  const { t } = useTranslation();

  return (
    <div
      className="w-full flex justify-center items-center bgi-[var(--grayscale-15)] cursor-pointer py-2 mt-2 mobile:mt-3 tablet:mt-5 box-border"
      onClick={props.onClick}
    >
      <span className="bgi-text-[var(--base-2-main)] text-base font-medium">
        {t('home_btn_load_more')}
      </span>
      <Icon
        className="w-5 h-5 mr-1"
        name="ic_arrow_down_2"
        color="var(--base-2-main)"
      />
    </div>
  );
};

export default LoadMoreButton;
