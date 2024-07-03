import { memo, useEffect, useRef, useState } from 'react';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import cx from '../../../../utils/cx';
import { useGesture } from '@use-gesture/react';
import { useSpring } from '@react-spring/web';
import { ArrowRight } from '../../../../components-bs/Icons/ArrowRight';
import { ArrowLeft } from '../../../../components-bs/Icons/ArrowLeft';
import { DragScrollContainer } from '../../../../components/DragScrollContainer';

interface IGameListSection {
  icon?: React.ReactElement;
  title: string | React.ReactElement[] | React.ReactElement;
  headerClassName?: string;
  titleClassName?: string;
  className?: string;
  gameListClassName?: string;
  children: React.ReactElement[] | React.ReactElement;
  isShowHeader?: boolean;
  loadMore?: () => void;
  expandedBrand?: boolean;
  isSearch?: boolean;
}
export const GameListSection = memo((props: IGameListSection) => {
  const { isDesktop, isTablet } = useBreakpoint();
  const { headerClassName, titleClassName, isSearch, icon, title, className, gameListClassName, children, isShowHeader = true } = props;

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [isAtStart, setIsAtStart] = useState(true)
  const [isAtEnd, setIsAtEnd] = useState(false)

  const handleClickToLeft = () => {
    const container = scrollContainerRef.current
    if (container) {
      setIsAtStart(container.scrollLeft == 0 ? true : false)
      container.scrollLeft -= 186 + 16; // 根据需要调整滚动距离
      const isAtEnd = Math.floor(container.scrollLeft + container.clientWidth) == container.scrollWidth
      setIsAtEnd(isAtEnd ? true : false)
    }
  };

  const handleClickToRight = () => {
    const container = scrollContainerRef.current
    if (container) {
      const isAtEnd = Math.floor(container.scrollLeft + container.clientWidth) == container.scrollWidth
      setIsAtEnd(isAtEnd ? true : false)
      container.scrollLeft += 186 + 16; // 根据需要调整滚动距离
      setIsAtStart(container.scrollLeft == 0 ? true : false)
    }
  };


  const [isOverflowedX, setIsOverflowedX] = useState(false);

  useEffect(() => {
    if (scrollContainerRef.current !== null) {
      const container = scrollContainerRef.current;
      const isOverflowedHorizontally = container?.scrollWidth > container?.clientWidth;
      setIsOverflowedX(isOverflowedHorizontally);
    }
  }, [children])


  const [, api] = useSpring(() => ({
    from: { left: 0 },
    onChange(v: any) {
      scrollContainerRef.current!.scroll({ left: v.value.left });
    }
  }));

  const bind = useGesture(
    {
      onWheel() {
        api.stop(); // 取消动画，让浏览器自己处理
      },
      onDrag(h: any) {
        api.start({
          left: -h.offset[0],
          immediate: true // 无动画过程
        });
        const container = scrollContainerRef.current
        setIsAtStart(container!.scrollLeft + container!.clientWidth == container!.clientWidth ? true : false)
        setIsAtEnd(container!.scrollLeft + container!.clientWidth == container!.scrollWidth ? true : false)
      }
    },
    {
      drag: {
        // 每次拖动传入 当前的 scrollLeft 作为初始状态
        from: () => [-scrollContainerRef.current!.scrollLeft, 0],
        axis: "x", // 仅在 x 方向 drag
        filterTaps: true
      }
    }
  );

  const btnClassName = "w-6 h-8 tablet:w-[46px] tablet:h-[60px] linear-5-button cursor-pointer absolute top-[34%] tablet:top-[40%] -translate-y-1/2";


  return (
    <div className={cx("flex flex-col w-full mb-2 mobile:mb-4", className)}>
      {isShowHeader &&
        (<div className={cx('flex flex-row justify-between mb-2 sm:mb-3.5 pl-1 sm:pl-0', headerClassName)}>
          <div className='flex justify-center items-center'>
            <div className=''>{icon && icon}</div>
            <div className={cx('text-base mobile:text-xl tablet:text-3xl font-medium items-center flex', titleClassName)}>{title}</div>
          </div>
        </div>)}

      <div className="relative">
        {
          (isDesktop || (isTablet && isSearch)) ? (
            <div {...bind()} ref={scrollContainerRef} className={cx("flex flex-1 overflow-hidden", gameListClassName)} style={{ touchAction: 'none' }}>
              {children}
            </div>
          ) : 
          <DragScrollContainer className={cx("flex flex-1 overflow-hidden", gameListClassName)}>
            {children}
          </DragScrollContainer>
        }
        {
          (isDesktop || (isTablet && isSearch)) && !isAtStart && isOverflowedX &&
          <div className={cx(
            "left-0 rounded-[4px] rounded-l-none",
            btnClassName
          )} onClick={handleClickToLeft}>
            <ArrowLeft className="w-5 h-5 tablet:w-10 tablet:h-10" />
          </div>
        }
        {
          (isDesktop || (isTablet && isSearch)) && !isAtEnd && isOverflowedX &&
          <div className={cx(
            "right-0 rounded-[4px] rounded-r-none",
            btnClassName
          )} onClick={handleClickToRight}>
            <ArrowRight className="w-5 h-5 tablet:w-10 tablet:h-10" />
          </div>
        }
      </div>
    </div>
  )
})
