import cx from '../../../../../utils/cx';

type ICarouselContainer = {
  className?: string;
  children: React.ReactNode;
  onClickBanner?: (event: any) => void;
  isMoving: boolean;
};
export const CarouselContainer = (props: ICarouselContainer) => {
  return (
    <div
      style={{
        touchAction: 'none',
      }}
      onClick={(event) => {
        if (props.isMoving) {
          event.preventDefault();
        } else {
          props.onClickBanner && props.onClickBanner(event);
        }
      }}
      className={cx(
        'group hover:cursor-pointer active:brightness-75 hover:brightness-125'
        // 'cursor-pointer'
      )}
    >
      <div className={cx('pointer-events-none', props.className)}>
        {props.children}
      </div>
    </div>
  );
};
