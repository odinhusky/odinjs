import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import { BackNavigation } from "../../../../components-bs/BackNavigation/BackNavigation";
import { usePageNavigate } from "../../../../router/hooks/usePageNavigate";
import { formatLocaleMoney } from "../../../../utils/format";
import { PageContainer } from "../../../../components-bs/PageContainer";
import { Table } from '../../../../components-bs/Table';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { NoData } from '../../../../components-bs/Table/env/u5/NoData';
import { useAllowLoginRouterRules } from "../../../../router/hooks/useAllowLoginRouterRules";
import { useGetSignInRecordMutation } from "../../../../../external";
import { GetSignInRecordResponseData } from "../../../../../external/endpoint/signin/GetSignInEndpoint";
import { AppLocalStorage } from "../../../../../persistant/localstorage";
import { AppLocalStorageKey } from "../../../../../persistant/AppLocalStorageKey";
import useTablePagination from '../../../../components-bs/Table/env/u6/useTablePagination';
import cx from '../../../../utils/cx';

export const DailySignInRecordPage = () => {
	useAllowLoginRouterRules();

	const [triggerGetSignInRecord, { data }] = useGetSignInRecordMutation();
	const [page, setPage] = useState(1);
	const [records, setRecords] = useState<GetSignInRecordResponseData[]>([])
	const { currentPage, goToPrevPage, goToNextPage, goToFirstPage } = useTablePagination({ dataCount: data?.data.length || 0 })


	const { isMobile } = useBreakpoint();

	const pageSize = 10

	const handleFetchData = () => {
		if (page < (data?.page?.page_count || 0)) {
			setPage(page + 1)
		}
	}

	const { onClickToCheckInDaily } = usePageNavigate();

	const columns = [
		{ title: 'ID', name: 'id', key: 'id' },
		{ title: 'Nivel VIP', name: 'vip_level', key: 'vip_level', render: (record: any) => `LV${record.vip_level}` },
		{ title: 'Coleta Contínua', name: 'days', key: 'days', render: (record: any) => record.days === 1 ? `${record.days}dia` : `${record.days}dias` },
		{ title: 'Recompensas', name: 'cashback', key: 'cashback', render: (record: any) => `R$ ${formatLocaleMoney(record.cashback / 100)}` },
		{ title: 'Tempo', name: 'created_at', key: 'created_at' },
	]

	const pages = Math.ceil(data?.data.length! / pageSize)

	const onPrevPage = () => {
		if (currentPage < 1) return;
		goToPrevPage()
	}

	const onNextPage = () => {
		if (currentPage >= pages) return;
		goToNextPage()
	}
	
	const getData = (page: number) => {
		triggerGetSignInRecord({
			limit: pageSize,
			page: page,
			token: AppLocalStorage.getItem(AppLocalStorageKey.token) || "",
		})
	}

	useEffect(() => {
		getData(currentPage)
	}, [currentPage])
	
	useEffect(() => {
		getData(page)
	}, [page])

	useEffect(() => {
		if (isMobile) {
			setRecords([...records, ...(data?.data || [])])
		} else {
			setRecords(data?.data || [])
		}

	}, [data?.data])
	
  useEffect(() => {
    if (!isMobile) {
      goToFirstPage()
    } else {
	  setRecords((data?.data || []).slice(0, pageSize))
    }
    setPage(1)
  }, [isMobile])

	const wrapperRef = useRef<HTMLDivElement>(null)

	const handleOnScroll = (e: any) => {
		const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight;

		if (bottom <= 30 && handleFetchData !== undefined) {
			handleFetchData()
		}
	}


	const TableItem = ({ children, className }: { children: ReactNode, className: string }) => {
		return (
			<div className={cx('flex justify-between items-center box-border', className)}>
				{children}
			</div>
		)
	}
	
	const MobilePage = () => {
		return (
			<div className='max-h-[70vh] overflow-y-auto' ref={wrapperRef} onScroll={handleOnScroll}>
				{
					records.length ? <>
						{records.map((record: any, i) => (
							<div key={i}
								className={"w-full mb-4 text-white"}
							>
								{columns.map((item, index) =>
									<div className='mt-1'>
										<TableItem key={index} className={index == 0 ? 'w-full h-11 p-2 rounded-lg bg--linear-3-disabled' : ''}>
											<div className={cx('text-sm', index == 0 ? 'text-white' : 'text-[var(--grayscale-80)]')}>{item.title}</div>
											<div className='text-sm font-medium'>{item.render ? item.render(record) : record[item.key]}</div>
										</TableItem>
									</div>
								)}
							</div>
						))}</> : <NoData className="w-full !py-4" imgClassName="!w-[120px] !h-[120px] mobile:!w-40 tablet:!w-50" textClassName="!text-xs mobile:!text-2xl !text-[var(--grayscale-60)]" />
				}
			</div>
		)
	}

	return (
		<PageContainer>
			<BackNavigation
				onClick={() => onClickToCheckInDaily()}
			/>
			<div className='px-5 py-4 mt-3 mobile:mt-4 tablet:mt-5 rounded-xl bg-[var(--grayscale-30)]'>

				<div>
					{
						isMobile
							? <MobilePage />
							: (
								<Table
									columns={columns || []}
									dataSource={records}
									dataCount={data?.data.length!}
									pages={pages!}
									currentPage={currentPage!}
									pageSize={pageSize!}
									onPrevPage={onPrevPage!}
									onNextPage={onNextPage!}
								/>
							)

					}
				</div>
			</div>
		</PageContainer>
	)
}
