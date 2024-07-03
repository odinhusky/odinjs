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
      {!isMobile && (
        <div className={cx("text-left",
          "mb-[8px] sm:mb-[8px] md:mb-[20px] lg:mb-[20px]",
          "text-xs sm:text-xs md:text-xl lg:text-2xl",
        )}>
          <div>{environment.platformName} ({environment.platformGroup}) <span className={"hidden sm:inline-block sm:ml-3"}>merece a sua confiança</span></div>
          {/*{isMobile && (<div>merece a sua confiança</div>)}*/}
          {!isMobile && <div className={"none md:block"}>O usuário é o primeiro, o jogo é justo e os fundos estão seguros</div>}
        </div>
      )}

      <div className={cx("text-left",
        "text-xl sm:text-xl md:text-3xl lg:text-7xl",
        "font-extrabold"
      )}>
        {props.children}
      </div>
    </PageContainer>
  )
}
