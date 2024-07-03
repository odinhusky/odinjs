import { CacheImage } from "../../../../../components/image/CacheImage";
import { IActivityButton } from "../../ActivityItem";
import { ActivityTextContainer } from "../../../ActivityTextContainer";
import { environment } from "../../../../../../../environments/environment";
import cx from "../../../../../utils/cx";
import { ActivityBadge } from "../../../../../components/Badge/ActivityBadge";
import useBreakpoint from "apps/gambling/src/app/ui/pageTemplate/hooks/useBreakpoint";

export const ActivityItem = (props: IActivityButton) => {
	const { category, isTop, title, src, onClick, fontConfig } = props;

	const { isTablet, isDesktop } = useBreakpoint();
	return (

		<div className={cx('relative', props.className)}>
			<button
				className='relative overflow-hidden'
				onClick={onClick && onClick}
			>
				<div
					className={'relative overflow-hidden'}>
					<CacheImage
						alt={""}
						className={"w-[100vw]"}
						src={`assets/${environment.uVersion}/${environment.mVersion}/event_banner_bg${isDesktop ? '' : isTablet ? '_t' : '_m'}.png`}
					>
					</CacheImage>
					<CacheImage
						alt={""}
						className={"absolute h-full right-[25px] mobile:right-[24px] tablet:right-[25px] top-0"}
						src={src ? src : ""}
					/>
					{isTop &&
						<CacheImage
							alt={""}
							className={cx(
								'absolute w-[103px] h-[26px] left-1 top-1 tablet:left-2 tablet:top-2',
							)}
							src={`assets/${environment.uVersion}/${environment.mVersion}/activity_hot_tag.png`}
						/>
					}

					<div
						className={cx(
							'flex flex-wrap justify-start box-border',
							'absolute transform -translate-y-1/2 top-1/2 pl-[calc(12.5%)] mobile:pl-[calc(7%)] tablet:pl-[calc(5%)] pr-[calc(34.5%)]  mobile:pr-[calc(34.5%)] tablet:pr-[calc(36%)]',
						)}
					>
							<ActivityTextContainer
								className="text-start text-lg tablet:text-3xl font-bold whitespace-pre-line"
								children={title}
								fontConfig={fontConfig}
							/>
					</div>
				</div>
			</button>
			<ActivityBadge activityType={category} className={cx(
				'bg-[var(--state-error-main)]',
				'shadow-[inset_0px_4px_4px_0px_rgba(255,255,255,0.25),_inset_0px_-4px_4px_0px_rgba(0,0,0,0.25)]',
				'absolute top-2 right-2 w-4 h-4',
			)} />
		</div>
	)

}