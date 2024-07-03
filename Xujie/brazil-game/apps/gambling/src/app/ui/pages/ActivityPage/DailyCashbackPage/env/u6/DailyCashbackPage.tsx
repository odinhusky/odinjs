import { IDailyCashbackPage } from "../../index";
import { PageContainer } from "../../../../../components-bs/PageContainer";
import { BackNavigation } from "../../../../../components-bs/BackNavigation/BackNavigation";
import { ActivityRecordButton } from "../../../HallPage/ActivityRecordButton";
import { PageOrModalPathEnum } from "../../../../../PageOrModalPathEnum";
import { CacheImage } from "../../../../../components/image/CacheImage";
import { ActivityTextContainer } from "../../../ActivityTextContainer";
import React, { ReactNode, useEffect } from "react";
import { TranslateStringToDOM } from "../../../TranslateStringToDOM";
import { environment } from "../../../../../../../environments/environment";
import { notification } from "antd";
import { ActivityPageRouter } from "../../../index";
import "../../../../ActivityPage/RecordPage/env/u6/index.scss";
import cx from "../../../../../utils/cx";
import { FLEX_CENTER } from "apps/gambling/src/assets/constant/style";


type BoxContainer = {
	children: React.ReactNode;
}
export const DailyCashbackPage = (props: IDailyCashbackPage) => {
	const {
		dalyCashbackData,
		redeemState,
		onRefreshDalyCashback,
		internalBannerRes,
		navigate,
		onClickToActivity,
		onClickRedeemable,
		isMobile,
		isTablet,
		isDesktop,
		fontConfig
	} = props;
	const { bannerTitle, yesterdayBets, todayBonus, tableHeads, tableBody, description, isRedeemable } = dalyCashbackData;
	const [api, contextHolder] = notification.useNotification();

	useEffect(() => {
		if (redeemState) {
			api.info({
				message: (<div className={'text-[var(--grayscale-100)]'}>{redeemState.message}</div>),
				className: cx(
					'rounded-md bg-[var(--grayscale-20)] border',
					redeemState.isError
						? 'border-[var(--state-error-main)]'
						: 'border-[var(--state-success-main)]',
				),
				icon: (
					<CacheImage
						className={cx('anticon anticon-check-circle w-8 -mr-1')}
						alt={'icon_success'}
						src={redeemState.isError ?
							`assets/${environment.uVersion}/icon_error_full.png`
							: `assets/${environment.uVersion}/icon_success_full.png`
						}
					/>
				),
				closeIcon: (
					<CacheImage
						className={cx('anticon-close anticon w-4 mt-1 hover:brightness-[1.3] active:brightness-[0.7]')}
						alt={'icon_close'}
						src={`assets/${environment.uVersion}/icon_close_empty.png`}
					/>
				)
			})
			if (onRefreshDalyCashback) {
				onRefreshDalyCashback();
			}
		}
	}, [redeemState])


	const BoxContainer = (props: BoxContainer) => {
		return (
			<div className={cx(
				'rounded-lg bg-[var(--grayscale-30)]',
				{ 'py-10 px-12': isDesktop },
				{ 'py-8 px-9': isTablet },
				{ 'py-4 px-5': isMobile }
			)}>
				{props.children}
			</div>
		)
	}

	const Item = ({ className, children }: { className: string, children: ReactNode }) => {
		return (
			<div className={cx('flex justify-between items-center', className)}>
				{children}
			</div>
		)
	}

	return (
		<PageContainer>
			{contextHolder}
			<BackNavigation
				className="text-base tablet:text-xl font-medium"
				onClick={() => {
					navigate(PageOrModalPathEnum.ActivityHallPage);
				}}
			/>

			<section className="">
				<div className={cx(
					'relative overflow-hidden mt-3 tablet:mt-7'
				)}>
					<CacheImage
						className={cx('w-full')}
						alt={'dalyCashback'}
						src={internalBannerRes}
					/>

					<div
						className={cx(
							{ 'text-[56px] font-black px-16 w-2/3': isDesktop },
							{ 'text-4xl font-bold px-8 w-2/3': isTablet },
							{ 'text-xl font-bold px-4 w-4/5': isMobile },
							'flex flex-wrap',
							'absolute transform -translate-y-1/2 top-1/2',
							'justify-start'
						)}>

						{bannerTitle.split(/\s+/).map(item =>
							<ActivityTextContainer
								children={item}
								fontConfig={fontConfig}
							/>
						)}
					</div>
				</div>
			</section>


			<section className="mt-3 mobile:mt-4 tablet:mt-6">
				<BoxContainer>

					{/*活動記錄按鈕*/}
					<div className={cx(
						'flex flex-wrap items-center justify-end',
						{ 'justify-center': isMobile }
					)}>
						<ActivityRecordButton
							name={"Reg de Coletas"}
							className={cx(
								'w-[135px] h-9 text-sm font-bold linear-1-button',
								'tablet:w-[148px] tablet:h-12 tablet:text-base tablet:font-medium ',
							)}
							onClick={() => {
								onClickToActivity({ category: ActivityPageRouter.RECORD })
							}}
						/>
					</div>

					{/*當前活動累積*/}
					<div
						className={cx(
							'flex flex-wrap justify-between items-center text-white mt-4 tablet:mt-5 p-3 mobile:p-4 tablet:p-5',
							'rounded-xl bg-[var(--grayscale-50)] text-center',
						)}>
						<div
							className={cx('flex flex-wrap justify-center gap-2 flex-1 items-center border-r border-[var(--transparente-50)]')}>
							<div className={cx('w-full mb-1 text-sm mobile:text-base tablet:text-lg font-medium')}>Apostas de ontem</div>
							<div
								className={cx('w-full text-lg tablet:text-xl font-medium text-[var(--state-error-main)]')}>{yesterdayBets}</div>
						</div>

						<div
							className={cx('flex flex-wrap justify-center gap-2 flex-1 items-center')}>
							<div className={cx('w-full mb-1 text-sm mobile:text-base tablet:text-lg font-medium')}>Bônus de suporte de hoje</div>
							<div
								className={cx('w-full text-base mobile:text-lg tablet:text-xl font-medium text-[var(--state-success-main)]',)}>{todayBonus}</div>
						</div>
					</div>

					{/*活動獎勵里程描述*/}

					<div className="py-3 px-4 mobile:py-4 mobile:px-6 tablet:py-6 tablet:px-10 mt-4 mobile:mt-5 rounded-xl bg-[var(--grayscale-40)]">

						{
							isMobile ?
								<div className=''>
									{
										tableBody.length ? <>
											{tableBody.map((record: any, i) => (
												<div key={i}
													className={"w-full mb-3 text-white"}
												>
													<Item key={i} className='w-full p-2 rounded-lg text-sm text-white table-head'>
														<div className={cx('font-medium')}>{tableHeads[0]}</div>
														<div className={cx('font-medium')}>{record.amount}</div>
													</Item>
													{record.subs.map((item: any) =>
														<div className='mt-1'>
															<div className="border-b border-[var(--grayscale-50)]">
																{
																	tableHeads.map((v, idx) =>
																		idx == 0 ? <></>
																			: <Item key={idx} className={cx('py-1 last:pt-0')}>
																				<div className={cx('text-xs text-[var(--grayscale-80)]')}>{v}</div>
																				<div className={cx('text-xs text-white')}>{idx == 1 ? item.brandName : item.rewards}</div>
																			</Item>
																	)
																}
															</div>
														</div>
													)}
												</div>
											))}</> : <></>
									}
								</div>
								: <div className="overflow-x-auto text-[var(--grayscale-100)] text-center rounded-xl mt-4">
									<table className="w-full">
										<thead
											className={cx('table-head')}>
											<tr>
												{tableHeads.map((item, index) => {
													return (<th className={cx('p-[10px] tablet:p-4 text-sm font-medium tablet:font-bold')}>{item}</th>)
												})}
											</tr>
										</thead>
										<tbody className={''}>
											{tableBody.map((item, index) => {
												return (
													item.subs.map((sItem, sIndex) => {
														return (
															<tr className={cx('bg-[var(--grayscale-30)] border-b border-[var(--grayscale-50)]')}>
																{sIndex === 0 &&
																	<td rowSpan={item.subs.length}
																		className={cx('p-4',
																		)}>
																		{item.amount}
																	</td>
																}
																<td className={cx(
																	'p-4 border-l border-[var(--grayscale-50)]',
																)}>{sItem.brandName}</td>
																<td className={cx(
																	'p-4 border-l border-[var(--grayscale-50)]',
																)}>{sItem.rewards}</td>
															</tr>
														)
													})
												)
											})}
										</tbody>
									</table>
								</div>
						}


						<div className={'flex justify-center mt-3 mobile:mt-4 tablet:mt-6'}>
							<button
								className={cx(
									'w-full h-10',
									'mobile:w-80 tablet:w-[400px] tablet:h-12',
									isRedeemable
										? 'linear-2-button'
										: 'disabled-button',
								)}
								disabled={!isRedeemable}
								onClick={onClickRedeemable}
							>
								<div className={cx(
                  'w-full h-full',
                  'text-sm tablet:text-base font-medium',
                  FLEX_CENTER
                )}>
                  {'Receber'}
                </div>
							</button>
						</div>
					</div>

					<div className={'mt-4 mobile:mt-5 tablet:mt-[18px]'}>
						<div
							className={cx(
								'w-full text-[var(--grayscale-70)] text-start',
							)}>
							<div className="flex items-center justify-center tablet:justify-start mb-3 tablet:mb-4">
								<img className="w-6 h-6 tablet:w-9 tablet:h-9 mr-2 tablet:mr-3 rounded-full bg-linear-1-main" src={`assets/${environment.uVersion}/icon=notice.png`} alt="notice" />
								<p className={'text-sm tablet:text-base font-medium'}>Nota especial:</p>
							</div>
							<TranslateStringToDOM htmlContext={description} />
						</div>
					</div>
				</BoxContainer>

			</section>




		</PageContainer>
	)
}