import { cx, useBreakPoint, useImgUrlByBreakPoint } from '@libs/commonUtils';
import { EResourceLevel } from '@mode2/utils';
import { useTranslation } from 'react-i18next';
import { NoDataProps } from '../NoDataProps';

export const NoData = (props: NoDataProps) => {
  const { t } = useTranslation();
  const { getImgUrlByBreakPoint } = useImgUrlByBreakPoint();
  const { isMobile, isTablet } = useBreakPoint();
  return (
    <div
      className={cx(
        'flex flex-col justify-center items-center',
        'gap-2 mobile:gap-3 my-[5%]',
        'font-medium text-xs mobile:text-sm bgi-text-[var(--grayscale-50)]',
        props.styles?.container
      )}
    >
      <img
        className={cx(
          'w-[146px] mobile:w-[172px] tablet:w-[215px] object-contain',
          props.styles?.img
        )}
        src={getImgUrlByBreakPoint(
          'img_no_results',
          EResourceLevel.V,
          isTablet,
          isMobile
        )}
        alt="noData"
      />

      <p>
        {props.text || t('help_center_inbox_there_are_currently_no_message')}
      </p>
    </div>
  );
};

export default NoData;
