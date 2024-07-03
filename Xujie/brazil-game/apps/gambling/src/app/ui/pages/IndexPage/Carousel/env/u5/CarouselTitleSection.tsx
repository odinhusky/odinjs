import cx from "classnames";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";

type ICarouselSubTitle = {
  children: React.ReactNode;
  className?: string;
}
export const CarouselTitleSection = (props: ICarouselSubTitle) => {
  const {isMobile} = useBreakpoint();
  return (
    <div
      className={cx("absolute transform -translate-y-1/2 pl-6 w-2/3",
        "top-1/2",
        "leading-none",
        props.className,
      )}
    >
      <div
        style={{
          textShadow: '0px 4px 4px #00000040'
        }}
        className={cx("text-left",
        "text-lg md:text-xl lg:text-xl",
        "leading-5 md:leading-6 lg:leading-7",
        "font-extrabold"
      )}>
        {props.children}
      </div>
    </div>
  )
}
