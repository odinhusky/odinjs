import { ITable } from "../../index";
import cx from "../../../../utils/cx";
import { NoData } from "../u5/NoData";
import { Pagination } from "./Pagination";

export const Table = (props: ITable) => {
	const { dataSource, columns, currentPage, pageSize, pages, dataCount, isHidePagination, onPrevPage, onNextPage } = props;

	return (
		<>
			<div className={cx('h-full w-full flex flex-col text-white', props?.containerClassName)}>
				<div className={cx("h-14 overflow-hidden rounded-lg")}>
					<table className='relative table w-full h-full no-scrollbar table-fixed'>
						<thead className={cx('py-[10px] tablet:py-[14px] text-white bg--linear-3-disabled', props?.theadClassName)}>
							{columns?.map((col: any, colIndex: number) => {
								if (col.isShow !== undefined ? col.isShow : true) {
									return (
										<th key={col.key}
											className={cx(`p-2 text-center break-normal`, props.titleStyle)}
											style={{
												width: `${col.width !== undefined ? col.width : 'auto'}`
											}}
										>
											{col.title}
										</th>
									)
								}
							}
							)}
						</thead>
					</table>
				</div>
				<div className={`h-full overflow-y-auto flex-1`}>
					<table className={cx('relative table w-full table-fixed h-full', props?.tableClassName)}>
						<tbody className={cx("")}>
							{dataSource.length === 0 ? <tr>
								<NoData className="w-full !py-4" imgClassName="!w-[120px] !h-[120px] mobile:!w-40 mobile:!h-40 tablet:!w-50 tablet:!h-50" textClassName="!text-xs mobile:!text-2xl !text-[var(--grayscale-60)]" />
							</tr> :
								dataSource.map((data: any, index: number) => {
									return <tr key={index} className="border-solid border-b last:border-b-0 border-[var(--grayscale-50)]">
										{columns?.map((col: any, colIndex: number) => {
											if (col.isShow !== undefined ? col.isShow : true) {
												return (
													<td key={col.key + colIndex}
														className={cx(`break-all text-center py-3 tablet:py-[10px]`,
															props.className,
															props.contentStyle
														)}
														style={{
															width: `${col.width !== undefined ? col.width : 'auto'}`,
															maxWidth: col.maxWidth ? col.maxWidth : '100%'
														}
														}
													>
														{col.render !== undefined ? col.render(data as any) : data[col.name]}
													</td>
												)
											}
										})}
									</tr>
								})
							}
						</tbody>
					</table>
				</div>
			</div>
			{
				!isHidePagination && dataSource.length ?
					<Pagination
						currentPage={currentPage!}
						pageSize={pageSize!}
						dataCount={dataCount}
						pages={pages!}
						onPrevPage={onPrevPage!}
						onNextPage={onNextPage!}
					/> : <></>
			}
		</>
	)
}