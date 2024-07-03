import t from "apps/gambling/src/assets/constant/lang";
import cx from "../../../../utils/cx";

export const Pagination = ({ className, currentPage, pageSize, pages, dataCount, onPrevPage, onNextPage }: {
	className?: string;
	currentPage: number;
	pageSize: number;
	dataCount: number;
	pages: number;
	onPrevPage: () => void;
	onNextPage: () => void;
}) => {

	const btnClassName = "w-[70px] tablet:w-[120px] h-10 text-sm tablet:text-base font-medium rounded-lg flex items-center justify-center cursor-pointer"
	const textClassName = "text-xs px-[10px] text-[var(--grayscale-80)] flex items-center justify-center"

	console.log(dataCount, pageSize)

	return (
		<div className={cx("flex item-center justify-end mt-5", className)}>
			<div className="h-7 flex item-center">
				<div className={cx(textClassName)}>Page</div>
				<div className={cx("bg-[var(--grayscale-40)]", textClassName)}>{currentPage}</div>
				<div className={cx(textClassName)} >/</div>
				<div className={cx(textClassName, "text-[var(--grayscale-90)]")}>{pages}</div>
			</div>
			<div className={cx("ml-6", currentPage == 1 ? 'bg-transparente-20 text-[var(--grayscale-70)] cursor-not-allowed' : 'linear-2-button', btnClassName)} onClick={()=>{
				currentPage > 1 && onPrevPage?.()
			}}>{t['Back']}</div>
			<div className={cx("ml-2", currentPage == pages ? 'bg-transparente-20 text-[var(--grayscale-70)] cursor-not-allowed' : 'linear-2-button', btnClassName)} onClick={()=>{
				currentPage < pages && onNextPage?.()
			}}>{t['Next']}</div>
		</div>
	)
}