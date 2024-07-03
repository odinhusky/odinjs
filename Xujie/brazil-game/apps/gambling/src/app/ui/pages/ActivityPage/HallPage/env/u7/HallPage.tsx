import { PageContainer } from "../../../../../components-bs/PageContainer";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import { ActivityItem } from "../../ActivityItem";
import { IHallPage } from "../../index";
import { ActivityPageRouter } from "../../../index";
import { useEffect, useState } from "react";
import { environment } from "../../../../../../../environments/environment";
import { usePageNavigate } from "../../../../../router/hooks/usePageNavigate";
import cx from "../../../../../utils/cx";
import { ActivityRecordButton } from "../../ActivityRecordButton";
import { BackNavigation } from "../../../../../components-bs/BackNavigation/BackNavigation";

export const HallPage = (props: IHallPage) => {
	const { onClickToActivity, isShowRecordButton, activityItems, fontConfig } = props;
	// const { isTablet, isDesktop } = useBreakpoint();
	const [fillEmpty, setFillEmpty] = useState<any>([]);
	const { onClickToIndex } = usePageNavigate();

	const { isMobile, isTablet, isDesktop } = useBreakpoint();
	// useEffect(() => {
	// 	if (activityItems.length <= 10) {
	// 		const len = 10 - activityItems.length
	// 		const imgUrl = `assets/${environment.uVersion}/${environment.mVersion}/event_banner_bg${isDesktop ? '' : isTablet ? '_t' : '_m'}.png`
	// 		setFillEmpty(Array(len).fill({ img: imgUrl }))
	// 	}
	// }, [activityItems])
	// console.log('activityItems', activityItems, fillEmpty);

	return (
	<div
		style={
		isMobile
			? {
				maxHeight: 'max-content',
				minHeight:'100vh',
				background: `url(assets/${environment.uVersion}/bg_activity.png)  50%  center / cover`,
			}
			: {}
		}
  >
	<PageContainer>
		<BackNavigation className={cx({ 'hidden': isMobile })} onClick={onClickToIndex} />
		<div className="mt-4 mobile:mt-5">
			<section className={cx('flex flex-wrap items-center justify-between')}>
				<div className={cx('text-[var(--grayscale-100)] font-bold tablet:font-black text-xl')}>
					Eventos
				</div>
				{isShowRecordButton &&
					<ActivityRecordButton
						name={"Reg de Coletas"}
						className={cx(
							'flex gap-2 linear-4-button border-popup-button rounded-[100px]',
							'text-sm py-[9px] px-[22px]',
							'text-[var(--grayscale-100)] font-blod'
						)}
						onClick={() => {
							onClickToActivity({ category: ActivityPageRouter.RECORD })
						}}
					/>
				}
			</section>

			<section className={cx("mt-4 mobile:mt-8 tablet:mt-5")}>

				{activityItems && <div
					className={'flex flex-wrap'}>
					{activityItems.map((item: { isTop: boolean; router: string; type: any; title: string; src: string | undefined; }, index: number) => {
						return (
							<ActivityItem
								key={item.title + index.toString()}
								isTop={item.isTop}
								category={item.router}
								name={`${item.type}`}
								title={item.title}
								className={'shrink-0 w-full mobile:w-[calc(50%-10px)] mb-4 mobile:mb-5 mobile:ml-5 odd:ml-0'}
								onClick={() => {
									onClickToActivity({ category: item.router })
								}}
								src={item.src}
								fontConfig={fontConfig}
							/>
						)
					})}
					{
						fillEmpty?.length && fillEmpty.map((item: { img: string }, index: number) => {
							return (
								<div
									key={item.img + index.toString()}
									className="relative rounded-xl mobile:w-[49%] mb-3 tablet:mb-5 mobile:ml-3 tablet:ml-4 odd:ml-0 bg-transparente-gray-30"
								>
									<img src={item.img} style={{ visibility: 'hidden' }} />
									<div className="absolute top-0 left-0 w-full h-full shrink-0 "></div>
								</div>
							)
						})
					}
				</div>}
			</section>
		</div>


	</PageContainer>
	</div>	
	)
}