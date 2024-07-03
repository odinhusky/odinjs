// import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
// import {environment} from "../../../../../../../environments/environment";
// import {usePageNavigate} from "../../../../../router/hooks/usePageNavigate";
// import {CarouselContainer} from "../../CarouselContainer";
// import {IAppCarouselContent} from "../../types";
// import {CarouselImage} from "./CarouselImage";
// import {CarouselTitleSection} from "./CarouselTitleSection";
//
// export const AppCarouselContent8= (props: IAppCarouselContent) => {
//   const {isMobile} = useBreakpoint();
//   const {onClickToFirstDeposit} = usePageNavigate();
//
//   return (
//     <CarouselContainer
//       isMoving={props.isMoving}
//       className={"text-[22.5px] text-white"}
//       onClickBanner={(event) => {
//         onClickToFirstDeposit();
//       }}
//     >
//       <div className={""}>
//         <CarouselTitleSection>
//           <span>Convide Amigos A maior recompensa para<br/>uma pessoa é R$20</span>
//         </CarouselTitleSection>
//         {isMobile ? (
//           <CarouselImage alt={"h5_banner_8"} src={`assets/${environment.uVersion}/${environment.mvVersion}/h5_banner_8.png`}/>
//         ): (
//           <CarouselImage alt={"banner_8"} src={`assets/${environment.uVersion}/${environment.mvVersion}/banner_8.png`}/>
//         )}
//       </div>
//     </CarouselContainer>
//   )
// }
//
//
