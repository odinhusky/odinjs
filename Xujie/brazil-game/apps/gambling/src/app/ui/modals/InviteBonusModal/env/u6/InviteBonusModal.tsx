import { IInitialChargeModal } from "../../index";
import { useInviteConfig } from "../../../../hooks/useInviteConfig";
import { environment } from "../../../../../../environments/environment";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import cx from "../../../../utils/cx";
import { ScrollBar } from "../../../../components/ScrollBar";

type IItem = {
	title: string;
	money: number;
	className?: string;
}
const Item = (props: IItem) => {
	return (
		<div
			className={cx(
				'w-full font-medium flex flex-row justify-between items-end bg-transparente-gray-30',
				'text-sm mb-2 py-2 px-3 rounded-lg',
				'mobile:text-base mobile:mb-3 mobile:px-2 mobile:rounded-xl',
				'tablet:text-lg tablet:px-8',
				'last:mb-0',
				props.className
			)}>
			<div className="text-left">
				<div className=" text-[var(--text-1)] font-bold">{props.title}</div>
				<div>Prêmio</div>
			</div>
			<div className="text-right text-base font-bold tablet:text-xl text-[var(--text-2)]">
				{`R$ ${props.money}`}
			</div>
		</div>
	)
}

type IInviteBonusButton = {
	className?: string;
	click: () => void;
	name: string;
}
const InviteBonusButton = (props: IInviteBonusButton) => {
	return (
		<button
			className={cx(
				'py-2 tablet:py-3',
				'text-sm tablet:text-base font-bold tablet:font-medium flex justify-center',
				props.className
			)}
			onClick={() => {
				props.click();
			}}
		>
			{props.name}
		</button>
	)
}

export const InviteBonusModal = (props: IInitialChargeModal) => {
	const { currentConfig } = useInviteConfig();
	const currentConfigItems = currentConfig ? currentConfig?.items : []
	const { isMobile, isTablet, isDesktop } = useBreakpoint()

	return (
		<div
			className={"z-[1005] fixed left-0 top-0 right-0 bottom-0 flex flex-col justify-center items-center w-full h-full bg-[rgba(0,0,0,0.65)] px-7"}
			onClick={() => {
				// props.close();
			}}>

			<div
				id="Alert1"
				className={cx(
					'relative bg-linear-6-main flex flex-col gap-2 items-center rounded-xl',
					'w-full mx-7 max-h-[85vh] text-white',
					isDesktop ? 'max-w-[552px]' : 'max-w-[400px]'
				)}>

				<button
					className={cx(
						'absolute top-2 right-2 mobile:top-3 mobile:right-3 rounded-full',
						'w-7 h-7 mobile:w-9 mobile:h-9 tablet:w-10 tablet:h-10',
						'flex justify-center items-center'
					)}
					onClick={() => {
						props.close();
					}}>

					<img
						className="w-3 h-3 mobile:w-4 mobile:h-4"
						src={`assets/${environment.uVersion}/ic_close_noBorder.png`}
						alt="close"
					/>
				</button>

				<div
					className={cx('text-center font-bold px-4 mobile:px-8 tablet:px-9 mt-8 mobile:mt-8')}>
					<div className={'w-full px-4'}>
						<img
							src={`assets/${environment.uVersion}/${environment.mvVersion}/invite_rewards${isMobile ? "_m" : isTablet ? "_t" : ""}.png`}
							alt="invite_bonus_mobile"
						/>
					</div>

					<p className={cx(
						'font-normal text-sm mobile:text-base tablet:text-lg',
						'pt-2 pb-3 mobile:pb-4 tablet:pb-5'
					)}>
						Bônus de primeira recarga para usuários convidados
					</p>

					<ScrollBar className={cx('w-full max-h-[48vh] overflow-y-auto')}>
						<div className="mr-1 mobile:mr-2">
							{currentConfigItems.map((item, index) => {
								if (currentConfigItems.length - 1 !== index) {
									// NOTICE: 型別遺失 這個沒有寫 number 沒有被檢測到要number, money={Number(item.reward)}
									return (
										<Item
											key={index}
											title={`Convidar ${item.num}-${Number(currentConfigItems[index + 1]?.num) - 1}`}
											money={(Number(item.reward) / 100)} />
									)
								} else {
									return (
										<Item
											key={index} title={`Convidar > ${item.num}`}
											money={Number(item.reward) / 100} />
									)
								}
							})}
						</div>
					</ScrollBar>

					<div className={'w-full flex gap-2 justify-between mt-3 mb-6 mobile:mt-4 mobile:mb-8 tablet:mt-5 tablet:mb-9'}>
						<InviteBonusButton
							className={cx('flex-1 linear-1-button')}
							name={'Ganhar Dinheiro'}
							click={() => {
								props.close();
							}}
						/>
						<InviteBonusButton
							className={cx('flex-1 linear-2-button')}
							name={'Convide Agora'}
							click={() => {
								props.onConfirm();
							}}
						/>
					</div>
				</div>

			</div>
		</div>
	)
}
