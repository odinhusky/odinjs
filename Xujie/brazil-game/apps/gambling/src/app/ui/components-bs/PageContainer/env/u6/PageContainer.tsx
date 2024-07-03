import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import {IContainer} from "../../index";
import cx from "../../../../utils/cx";

export const PageContainer = (props: IContainer) => {
  const isY = typeof props.y === "undefined" ? true : props.y;
  const {isMobile, isTablet} = useBreakpoint();
  return (
    <div
      id={props.id}
      className={cx(
        // common
        'pt-0 pb-0 px-4',
        // mobile
        'pt-3 pb-[120px] mb-10',
        // tablet (768px)
        'mobile:pt-3 mobile:pb-[128px] mobile:px-8 mobile:mb-10',
        // desktop (1920px)
        // 'tablet:box-content tablet:max-w-[1200px] tablet:mx-auto',
        'tablet:box-border tablet:max-w-[1200px] tablet:mx-auto',
        'tablet:pt-5 tablet:pb-4 tablet:px-0 tablet:mb-0',
        // isMobile && 'pt-3 pb-32', isTablet && 'pb-32',
        // "lg:box-content lg:mx-auto lg:px-24",
        //   'pb-[116px]',
        "flex-grow",
        props.className
      )}
      onClick={props.onClick}
    >{props.children}</div>
  )
}
