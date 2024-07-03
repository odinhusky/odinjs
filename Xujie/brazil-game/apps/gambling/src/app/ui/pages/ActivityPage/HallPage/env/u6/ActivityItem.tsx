import { CacheImage } from "../../../../../components/image/CacheImage";
import { IActivityButton } from "../../ActivityItem";
import { ActivityTextContainer } from "../../../ActivityTextContainer";
import { environment } from "../../../../../../../environments/environment";
import cx from "../../../../../utils/cx";
import {ActivityBadge} from "../../../../../components/Badge/ActivityBadge";

export const ActivityItem = (props: IActivityButton) => {
	const {category, isTop, title, src, onClick, fontConfig } = props;
	
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
						src={src ? src : ""}
					/>

					{isTop &&
						<CacheImage
							alt={""}
							className={cx(
								'absolute left-[0px] top-[3px]',
								'mobile:top-[3px]',
								'tablet:left-[0px] tablet:top-[6px]'
							)}
							src={`assets/${environment.uVersion}/${environment.mVersion}/activity_hot_tag.png`}
						/>
					}

					<div
						className={cx(
							'flex flex-wrap justify-start box-border',
							'absolute transform -translate-y-1/2 top-1/2 pl-4 pr-20 tablet:pl-8',
						)}
					>
						{title.split(/\s+/).map(item =>
							<ActivityTextContainer
								className="text-base mobile:text-lg tablet:text-2xl font-bold"
								children={item}
								fontConfig={fontConfig}
							/>
						)}

					</div>
				</div>
			</button>
			<ActivityBadge activityType={category} className={cx(
				'bg-[var(--state-error-main)]',
				'shadow-[0px_2px_2px_0px_rgba(38,_33,_44,_0.4),_inset_0px_-2px_2px_0px_rgba(0,_0,_0,_0.4),_inset_0px_2px_2px_0px_rgba(255,_255,_255,_0.4)]',
				'absolute top-0 right-0 -mt-0 -mr-2 w-4 h-4',
				'mobile:-mr-2 mobile:w-5 mobile:h-5'
			)}/>
		</div>
	)

}