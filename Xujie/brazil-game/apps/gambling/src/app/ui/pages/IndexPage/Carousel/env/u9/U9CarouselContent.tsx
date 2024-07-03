import cx from 'apps/gambling/src/app/ui/utils/cx';
import { IndexBannerType } from '../../../hooks/useU9IndexPageBase';
import U9CarouselContainer from './U9CarouselContainer';
import { CarouselImage } from './CarouselImage';
import { CarouselTitleSection } from './CarouselTitleSection';
import { FLEX_COL } from 'apps/gambling/src/assets/constant/style';

interface CarouselContentProps extends IndexBannerType {
  isMoving: boolean;
}

export const U9CarouselContent = ({
  text1,
  text2,
  bgAlt,
  bgSrc,
  action,
  isTextStyleReverse,
  isMoving,
}: CarouselContentProps) => {
  const titleClass = cx('font-normal text-white', 'text-[24px] leading-[32px]');

  const normaTextClass = cx(
    'font-normal text-white',
    'text-[16px] leading-[20px]'
  );

  return (
    <U9CarouselContainer
      isMoving={isMoving}
      className={'w-full'}
      onClickBanner={action}
    >
      <CarouselImage
        className={cx('rounded-lg')}
        alt={bgAlt}
        genieSrc={bgSrc}
      />

      <CarouselTitleSection className={cx(FLEX_COL, 'gap-1')}>
        <div
          className={cx(`${isTextStyleReverse ? titleClass : normaTextClass}`)}
        >
          {text1}
        </div>

        <div
          className={cx(`${isTextStyleReverse ? normaTextClass : titleClass}`)}
        >
          {text2}
        </div>
      </CarouselTitleSection>
    </U9CarouselContainer>
  );
};

export default U9CarouselContent;
