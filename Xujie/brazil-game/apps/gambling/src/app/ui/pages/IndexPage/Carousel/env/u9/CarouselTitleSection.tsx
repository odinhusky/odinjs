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
        'absolute transform -translate-y-1/2  top-1/2',
        'px-3',
        // 'tablet:px-8',
        'w-4/5',
        // 'mobile:w-2/3, tablet:w-2/3',
        props.className
      )}
    >
      {props.children}
    </div>
  );
};
