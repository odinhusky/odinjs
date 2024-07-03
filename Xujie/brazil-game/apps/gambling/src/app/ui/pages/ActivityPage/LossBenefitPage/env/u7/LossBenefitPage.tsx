import { ILossBenefitPage } from "../../index";
import { PageContainer } from "../../../../../components-bs/PageContainer";
import { BackNavigation } from "../../../../../components-bs/BackNavigation/BackNavigation";
import { PageOrModalPathEnum } from "../../../../../PageOrModalPathEnum";
import { CacheImage } from "../../../../../components/image/CacheImage";
import { ActivityRecordButton } from "../../../HallPage/ActivityRecordButton";
import React, { ReactNode, useEffect } from "react";
import { ActivityTextContainer } from "../../../ActivityTextContainer";
import { TranslateStringToDOM } from "../../../TranslateStringToDOM";
import { notification } from "antd";
import { environment } from "../../../../../../../environments/environment";
import { ActivityPageRouter } from "../../../index";
import cx from "../../../../../utils/cx";
import "../../../../ActivityPage/RecordPage/env/u6/index.scss";
import { FLEX_CENTER } from "apps/gambling/src/assets/constant/style";
import styled from "styled-components";


const BorderStrokeAmount = styled.div`
  position: relative;
  &::before {
    content: '';
    left: 0px;
    top: 0px;
    display: block;
    border-radius: 8px;
    border: 2px solid transparent;
    background: var(--stroke-amount) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    position: absolute;
    width: 100%;
    height: 100%;
  }
`;
const BorderStrokePopup = styled.div`
  position: relative;
  &::before {
    content: '';
    left: 0px;
    top: 0px;
    display: block;
    border-radius: 8px;
    border: 2px solid transparent;
    background: var(--stroke-popup) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    position: absolute;
    width: 100%;
    height: 100%;
  }
`;

/**
 * 活動頁面[救援金]
 */
export const LossBenefitPage = (props: ILossBenefitPage) => {
	const {
		lossBenefitData,
		redeemState,
		onRefreshLossBenefit,
		internalBannerRes,
		navigate,
		onClickToActivity,
		onClickRedeemable,
		isMobile,
		isTablet,
		isDesktop,
		fontConfig
	} = props;
	const { bannerTitle, yesterdayLoss, todayBonus, tableHeads, tableBody, description, isRedeemable/**/ } = lossBenefitData;
	const [api, contextHolder] = notification.useNotification();
	// const isRedeemable = false;
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
			if (onRefreshLossBenefit) {
				onRefreshLossBenefit();
			}
		}
	}, [redeemState])

	let count = 0;

	return (
		<PageContainer>
			{contextHolder}
			<BackNavigation
				className="text-base tablet:text-xl font-medium"
				onClick={() => {
					navigate(PageOrModalPathEnum.ActivityHallPage);
				}}
			/>

			<section className="mt-4 mobile:mt-[38px] tablet:mt-8 flex flex-col gap-5 mobile:gap-8">
				{/* banner */}
				<div className={cx(
					'relative overflow-hidden'
				)}>
					<CacheImage
						alt={""}
						className={"w-[100vw]"}
						src={`assets/${environment.uVersion}/${environment.mVersion}/event_banner_bg${isDesktop ? '' : isTablet ? '_t' : '_m'}.png`}
					>
					</CacheImage>
					<CacheImage
						alt={"dalyCashback"}
						className={"absolute h-full right-[25px] mobile:right-[24px] tablet:right-[25px] top-0"}
						src={internalBannerRes}
					/>

					<div
						className={cx(
							'tablet:text-5xl mobile:text-4xl text-lg font-bold',
							'flex flex-wrap pl-[calc(7%)] pr-[calc(34.5%)]',
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
							'flex gap-2 linear-4-button border-popup-button rounded-[100px]',
							'text-sm py-[9px] px-[22px]',
							'text-[var(--grayscale-100)] font-blod'
						)}
						onClick={() => {
							onClickToActivity({ category: ActivityPageRouter.RECORD })
						}}
					/>
				</div>

				{/*當前活動累積*/}
				<div
					className={cx(
						'flex flex-wrap justify-between items-center text-[var(--grayscale-100)] gap-5 mobile:gap-8',
					)}>
					<BorderStrokeAmount
						className={cx(
							'w-full h-[109px] mobile:h-[114px] rounded-lg font-bold text-[var(--grayscale-100)] text-center',
							'flex flex-1 flex-col justify-center items-center bg-linear-4-main',
							'gap-3 mobile:gap-5',
						)}
					>
						<div className={cx('w-full text-sm mobile:text-lg')}>
							Perdas de ontem
						</div>
						<div
							className={cx('w-full text-base mobile:text-2xl text-[var(--state-error-main)]')}
						>
							{yesterdayLoss}
						</div>
					</BorderStrokeAmount>
					<BorderStrokeAmount
						className={cx(
							'w-full h-[109px] mobile:h-[114px] rounded-lg font-bold text-[var(--grayscale-100)] text-center',
							'flex flex-1 flex-col justify-center items-center bg-linear-4-main',
							'gap-3 mobile:gap-5',
						)}
					>
						<div className={cx('w-full text-sm mobile:text-lg')}>
							Bônus de suporte de hoje
						</div>
						<div
							className={cx('w-full text-base mobile:text-2xl text-[var(--state-success-main)]',)}>
							{todayBonus}
						</div>
					</BorderStrokeAmount>
				</div>

				{/*活動獎勵里程描述*/}

				<div className="w-full rounded-lg overflow-hidden h-full flex flex-col bg-linear-4-main text-center text-xs mobile:text-sm text-[var(--grayscale-100)] border-[1.5px] border-[var(--transparent-white-5)] shadow-[0_4px_4px_rgba(0,0,0,0.25)]">

					{
						<table className="w-full">
							<thead
								className={cx('')}>
								<tr>
									{tableHeads.map((item, index) => {
										return (<th
											key={item + index.toString()}
											className={cx(
												'bg-[var(--transparent-white-5)] py-[12px] mobile:py-[11px] font-medium text-[var(--grayscale-80)]',
												index < tableHeads.length - 1 ? 'border-r-[0.5px] border-[var(--transparent-white-10)]' : ''
											)}>{item}</th>)
									})}
								</tr>
							</thead>
							<tbody className={''}>
								{tableBody.map((item, index) => {
									return (
										item.subs.map((sItem, sIndex) => {
											if (sIndex === 0 && tableBody[index - 1]) {
												if (tableBody[index - 1].subs) {
													count += tableBody[index - 1].subs.length % 2;
												}
											}
											return (
												<tr
													key={sItem.brandName + sIndex.toString()}
													className={cx('')}
												>
													{sIndex === 0 &&
														<td rowSpan={item.subs.length}
															className={cx(
																'border-r-[0.5px] border-[var(--transparent-white-10)]',
																index % 2 == 1 ? 'bg-[var(--transparent-white-5)]' : ''
															)}>
															{item.amount}
														</td>
													}
													<td className={cx(
														'border-r-[0.5px] border-[var(--transparent-white-10)] py-[12px] mobile:py-[11px]',
														(sIndex + count) % 2 == 1 ? 'bg-[var(--transparent-white-5)]' : ''
													)}>{sItem.brandName}</td>
													<td className={cx(
														'py-[12px] mobile:py-[11px]',
														(sIndex + count) % 2 == 1 ? 'bg-[var(--transparent-white-5)]' : ''
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
							'w-full max-w-[480px] h-[48px] rounded-[100px] linear-1-button',
							'border border-[var(--grayscale-60)] shadow-[inset_0_0px_8px_rgb(255,255,255),0_4px_4px_rgba(0,0,0,0.25)]',
							isRedeemable
								? ''
								: '',
						)}
						disabled={!isRedeemable}
						onClick={onClickRedeemable}
					>
						<div className={cx(
							'w-full h-full',
							'text-lg font-bold text-[var(--grayscale-100)]',
							FLEX_CENTER,
							{
								"text-[var(--transparent-white-30)]":!isRedeemable
							}
						)}>
							{'Receber'}
						</div>
					</button>
				</div>

				<BorderStrokePopup className={'rounded-lg p-5 mobile:p-8 bg-linear-4-main'}>
					<div
						className={cx(
							'w-full text-[var(--grayscale-80)] text-start text-sm mobile:text-base',
						)}>
						<div className="flex items-center justify-start mb-4 mobile:mb-5">
							<p className={'text-lg mobile:text-xl font-bold text-[var(--grayscale-100)]'}>Nota especial:</p>
						</div>
						<TranslateStringToDOM htmlContext={description} />
					</div>
				</BorderStrokePopup>
			</section>

		</PageContainer>
	)

}