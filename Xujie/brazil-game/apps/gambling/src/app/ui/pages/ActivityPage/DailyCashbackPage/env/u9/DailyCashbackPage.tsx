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
import styled from "styled-components";

/**
 * 活動頁面[每日返水]
 */
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
	console.log('tabdata', dalyCashbackData);

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

	// let count = 0;

	return (
		<PageContainer >
			{contextHolder}
			<BackNavigation
				title={"Bônus de suporte diário de perdas"}
				className="text-base font-bold"
				onClick={() => {
					navigate(PageOrModalPathEnum.ActivityHallPage);
				}}
			/>

			<section className="mt-3 flex flex-col gap-5">
				{/* banner */}
				<div className={cx(
					'relative overflow-hidden rounded-xl shadow-[0px_0px_4px_#FFFFFF]',
				)}>
					<CacheImage
						alt={""}
						className={"w-[100vw]"}
						src={`assets/${environment.uVersion}/${environment.mVersion}/internal_event_banner_daily_rebate${isDesktop ? '' : isTablet ? '_t' : '_m'}.png`}
					>
					</CacheImage>
					<CacheImage
						alt={"dalyCashback"}
						className={"absolute h-full right-0 top-0"} /*mobile:right-[24px] tablet:right-[25px]*/
						src={internalBannerRes}
					/>

					<div
						className={cx(
							'text-2xl',
							'flex flex-wrap pl-[calc(3.4%)] pr-[calc(30.6%)]',
							'absolute transform -translate-y-1/2 top-1/2',
							'justify-start'
						)}>

						{bannerTitle.split(/\s+/).map((item, index) =>
							<ActivityTextContainer
								key={item + index.toString()}
								children={item}
								fontConfig={fontConfig}
							/>
						)}
					</div>
				</div>

				{/*活動記錄按鈕*/}
				<div className={cx(
					'flex flex-wrap items-center justify-end',
				)}>
					<ActivityRecordButton
						name={"Reg de Coletas"}
						className={cx(
							'flex tertiary-button rounded-[4px]',
							'text-xs py-[4px] px-[8px]',
							'text-[var(--grayscale-25)] font-medium'
						)}
						onClick={() => {
							onClickToActivity({ category: ActivityPageRouter.RECORD })
						}}
					/>
				</div>

				{/*當前活動累積*/}
				<div
					className={cx(
						'flex flex-wrap justify-between items-center text-[var(--grayscale-100)] gap-2',
					)}>
					<div
						className={cx(
							'w-full rounded-lg font-bold text-[var(--grayscale-100)] text-center',
							'flex flex-1 flex-col justify-center items-center bg-[var(--transparent-gray-20)]',
							'gap-3 p-3',
						)}
					>
						<div className={cx('w-full text-sm font-medium')}>
							Apostas de ontem
						</div>
						<div
							className={cx('w-full text-base font-bold text-[var(--tertiary-main)]')}
						>
							{yesterdayBets}
						</div>
					</div>
					<div
						className={cx(
							'w-full rounded-lg font-bold text-[var(--grayscale-100)] text-center',
							'flex flex-1 flex-col justify-center items-center bg-[var(--transparent-gray-20)]',
							'gap-3 p-3',
						)}
					>
						<div className={cx('w-full text-sm font-medium')}>
							Bônus de suporte de hoje
						</div>
						<div
							className={cx('w-full text-base font-bold text-[var(--tertiary-main)]',)}>
							{todayBonus}
						</div>
					</div>
				</div>

				{/*活動獎勵里程描述*/}

				<div className="w-full rounded-lg overflow-hidden h-full flex flex-col bg-[var(--transparent-gray-10)] text-center text-xs text-[var(--grayscale-100)] border-[0.5px] border-[var(--grayscale-40)]">
					{
						<table className="w-full">
							<thead
								className={cx('')}
							>
								<tr
									className={cx('border-r-[0.5px] border-[var(--transparent-10)]')}
								>
									{tableHeads.map((item, index) => {
										return (<th
											key={item + index.toString()}
											className={cx(
												'bg-[var(--transparent-gray-20)] py-2 px-1',
												// index < tableHeads.length - 1 ? 'border-r-[0.5px] border-[var(--transparent-white-10)]' : ''
											)}>{item}</th>)
									})}
								</tr>
							</thead>
							<tbody className={''}>
								{tableBody.map((item, index) => {
									return (
										item.subs.map((sItem, sIndex) => {
											// if (sIndex === 0 && tableBody[index - 1]) {
											// 	if (tableBody[index - 1].subs) {
											// 		count += tableBody[index - 1].subs.length % 2;
											// 	}
											// }
											return (
												<tr
													key={sItem.brandName + sIndex.toString()}
													className={cx(
													)}
												>
													{sIndex === 0 &&
														<td rowSpan={item.subs.length}
															className={cx(
																'py-2 px-1',
																{ 'bg-[var(--transparent-gray-10)]': index % 2 == 1 },
																{ 'border-t-[0.5px] border-[var(--transparent-10)]': sIndex === 0 }
															)}>
															{item.amount}
														</td>
													}
													<td className={cx(
														'py-2 px-1',
														{ 'bg-[var(--transparent-gray-10)]': index % 2 == 1 },
														{ 'border-t-[0.5px] border-[var(--transparent-10)]': sIndex === 0 }
													)}>{sItem.brandName}</td>
													<td className={cx(
														'py-2 px-1',
														{ 'bg-[var(--transparent-gray-10)]': index % 2 == 1 },
														{ 'border-t-[0.5px] border-[var(--transparent-10)]': sIndex === 0 }
													)}>{sItem.rewards}</td>
												</tr>
											)
										})
									)
								})}
							</tbody>
						</table>
					}
				</div>

				<div className={'flex justify-center w-full'}>
					<button
						className={cx(
							'text-base text-[var(--grayscale-30)] font-bold',
							'w-[200px] h-[40px] rounded-[100px] tertiary-button',
						)}
						disabled={!isRedeemable}
						onClick={onClickRedeemable}
					>
						{'Receber'}
					</button>
				</div>

				<div className={''}>
					<div
						className={cx(
							'w-full text-[var(--grayscale-70)] text-start text-xs font-medium',
						)}
					>
						<div className="flex items-center justify-start mb-0.5">
							<p className={'text-[var(--grayscale-100)]'}>Nota especial:</p>
						</div>
						<TranslateStringToDOM htmlContext={description} />
					</div>
				</div>
			</section>

		</PageContainer>
	)
}