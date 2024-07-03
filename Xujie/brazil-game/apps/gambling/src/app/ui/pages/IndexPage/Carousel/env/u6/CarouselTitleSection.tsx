import cx from '../../../../../utils/cx';

type ICarouselSubTitle = {
  children: React.ReactNode;
  className?: string;
};
export const CarouselTitleSection = (props: ICarouselSubTitle) => {
  return (
    <div
      style={{
        textShadow: '0px 4px 4px #00000040',
      }}
      className={cx(
        'text-white text-left',
        'absolute transform -translate-y-1/2 w-3/5 top-1/2',
        'text-xl font-bold px-4',
        'mobile:text-xl mobile:px-4 mobile:w-2/3',
        'tablet:text-4xl tablet:font-black tablet:px-8 tablet:w-2/3',
        props.className
      )}
    >
      {props.children}
    </div>
  );
};
