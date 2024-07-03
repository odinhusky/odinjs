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
	const { isTablet, isDesktop } = useBreakpoint();
	const [fillEmpty, setFillEmpty] = useState<any>([]);
	const { onClickToIndex } = usePageNavigate();

	useEffect(() => {
		if (activityItems.length <= 10) {
			const len = 10 - activityItems.length
			const imgUrl = `assets/${environment.uVersion}/${environment.mVersion}/event_banner_cashback${isDesktop ? '' : isTablet ? '_t' : '_m'}.png`
			setFillEmpty(Array(len).fill({ img: imgUrl }))
		}
	}, [activityItems])

	return (
		<PageContainer>
			{/*<BackNavigation*/}
			{/*	onClick={() => onClickToIndex()}*/}
			{/*/>*/}
			<div className="mt-3 mobile:mt-4 tablet:mt-6">
				<section className={cx('flex flex-wrap items-center justify-between')}>
					<div className={cx('text-[var(--grayscale-100)] font-bold tablet:font-black text-xl mobile:text-2xl tablet:text-[40px]')}>
						Eventos
					</div>
					{isShowRecordButton &&
						<ActivityRecordButton
							name={"Reg de Coletas"}
							className={cx(
								'flex gap-2 linear-2-button',
								'text-sm tablet:text-base py-2 px-5 mobile:py-2.5 tablet:py-3 tablet:px-[46px]',
								'text-[var(--grayscale-100)] font-medium'
							)}
							onClick={() => {
								onClickToActivity({ category: ActivityPageRouter.RECORD })
							}}
						/>
					}
				</section>

				<section className={cx("mt-3 mobile:mt-4 tablet:mt-7")}>

					{activityItems && <div
						className={'flex flex-wrap'}>
						{activityItems.map((item: { isTop: boolean; router: string; type: any; title: string; src: string | undefined; }) => {
							return (
								<ActivityItem
									isTop={item.isTop}
									category={item.router}
									name={`${item.type}`}
									title={item.title}
									className={cx('shrink-0 w-full mobile:w-[49%] mb-1 tablet:mb-2 mobile:ml-3 tablet:ml-4 odd:ml-0')}
									onClick={() => {
										onClickToActivity({ category: item.router })
									}}
									src={item.src}
									fontConfig={fontConfig}
								/>
							)
						})}
						{
							fillEmpty?.length && fillEmpty.map((item: { img: string }) => {
								return (
									<div className="relative  mobile:w-[49%] mb-3 tablet:mb-5 mobile:ml-3 tablet:ml-4 odd:ml-0 ">
										<img src={item.img} style={{ visibility: 'hidden' }} />

										<div className={cx(
											'rounded-xl mobile:rounded-xl tablet:rounded-2xl',
											'absolute bottom-0 left-0 w-full h-[94%] shrink-0 bg-transparente-gray-30'
										)}></div>
									</div>
								)
							})
						}
					</div>}
				</section>
			</div>


		</PageContainer>
	)
}