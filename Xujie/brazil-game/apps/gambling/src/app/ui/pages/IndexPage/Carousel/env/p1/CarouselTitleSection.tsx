import {environment} from "../../../../../../../environments/environment";
import cx from "classnames";
import {PageContainer} from "../../../../../components-bs/PageContainer";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";

type ICarouselSubTitle = {
  children: React.ReactNode;
  className?: string;
}
export const CarouselTitleSection = (props: ICarouselSubTitle) => {
  const {isMobile} = useBreakpoint();
  return (
    <PageContainer
      className={cx("absolute transform -translate-y-1/2",
        "top-1/2",
        "leading-none",
        props.className,
      )}
    >
      <div className={cx("text-left",
        "text-xl sm:text-xl md:text-3xl lg:text-7xl",
        "font-extrabold"
      )}>
        {props.children}
      </div>
    </PageContainer>
  )
}
