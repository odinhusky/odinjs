import { DatePicker } from 'antd';
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import { BackNavigation } from "../../../../components-bs/BackNavigation/BackNavigation";
import { usePageNavigate } from "../../../../router/hooks/usePageNavigate";
import RangeDatePicker from "../../../../components-bs/DatePickers/RangeDatePicker";
import moment from "moment";
import { Moment } from "moment/moment";
import { datePickerStyle } from "../../../../components-bs/DatePickers/DatePicker";
import { environment } from "../../../../../../environments/environment";
import { formatLocaleMoney } from "../../../../utils/format";
import { IGameRecordPageProps } from "../../index";
import { PageContainer } from "../../../../components-bs/PageContainer";
import { Table } from '../../../../components-bs/Table';
import { ReactNode, useEffect, useRef } from 'react';
import { NoData } from '../../../../components-bs/Table/env/u5/NoData';
import cx from '../../../../utils/cx';
import "./index.scss";

const { RangePicker } = DatePicker;

export const GameRecordPage = ({
	dates,
	setDates,
	handleFetchData,
	records,
	dataCount,
	currentPage,
	pageSize,
	pages,
	onPrevPage,
	onNextPage
}: IGameRecordPageProps) => {

	const wrapperRef = useRef<HTMLDivElement>(null)

	const { isMobile } = useBreakpoint();

	const max = moment();

	const { onClickToIndex } = usePageNavigate();

	const handleOnScroll = (e: any) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight;

    if (bottom <= 30 && handleFetchData !== undefined) {
      handleFetchData()
    }
  }

	useEffect(() => {
		if (wrapperRef?.current?.scrollHeight !== undefined) {
			const scrollbarVisible = wrapperRef?.current?.scrollHeight > wrapperRef?.current?.clientHeight;

			// 如果滾軸沒有出現，判斷是否還有資料
			if (!scrollbarVisible &&
				handleFetchData !== undefined &&
				(Number(dataCount) - Number(records.length) > 0)
			) {
				handleFetchData();
			}
		}
	}, [records])


	const columns = [
		{
			title: 'Nome do jogo',
			name: 'gameName',
			key: 'gameName',
			isHide: isMobile ? true : false,
			render: (record: any) => (
				<div className='flex items-center'>
					<div>
						<img
							alt='gameLogo'
							className='mx-auto w-10 h-10 mr-2 rounded-lg object-cover'
							src={`${environment.s3URLImages}/${record.gameId}-small.png`}
						/>
					</div>
					<div>
						{record.gameName}
					</div>
				</div>
			)
		},
		{
			title: 'Tempo',
			name: 'createTime',
			key: 'createTime',
			render: (record: any) => (
				<div className={cx(isMobile ? 'flex' : '')}>
					<div className={cx(isMobile ? 'mr-1' : '')}>{moment(record.createTime.split(" ")[0]).format('DD.MM.YYYY')}</div>
					<div>{record.createTime.split(" ")[1]}</div>
				</div>
			)
		},
		{
			title: 'Valor Da Aposta',
			name: 'bet',
			key: 'bet',
			render: (record: any) => (
				<>R$ {formatLocaleMoney(record.bet / 100)}</>
			)
		},
		{ title: 'Lucro', name: 'win', key: 'win', render: (record: any) => formatLocaleMoney(record.win / 100) }
	]

	const TableItem = ({ children }: { children: ReactNode }) => {
		return (
			<div className='flex justify-between items-center'>
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
								<div className='w-full h-11 px-2 rounded-lg flex items-center bg--linear-3-disabled'>
									<img
										alt='game-logo'
										className='w-9 h-9 mr-1 rounded-lg object-cover'
										src={`${environment.s3URLImages}/${record.gameId}-small.png`}
									/>
									<div>
										<div className='text-sm font-medium'>Nome do jogo</div>
										<div className='text-xs'>{record.gameName}</div>
									</div>
								</div>
								{columns.map((item, index) =>
									<div className='mt-1'>
										{!item.isHide &&
											<TableItem key={index}>
												<div className='text-sm text-[var(--grayscale-80)]'>{item.title}</div>
												<div className='text-sm font-medium'>{item.render(record)}</div>
											</TableItem>}
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
			<BackNavigation/>
			<div className='px-5 py-4 mt-3 mobile:mt-4 tablet:mt-5 rounded-xl bg-[var(--grayscale-30)]'>
				<section className='mb-4 mobile:mb-6 flex justify-end text-white'>
					{
						isMobile ?
							(
								<RangeDatePicker
									min='2023-01-01'
									max={max.format('YYYY-MM-DD')}
									className="bg-white text-black"
									onConfirm={(values) => setDates([moment(values[0], 'YYYY-MM-DD'), moment(values[1], 'YYYY-MM-DD')])}
									value={[dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')]}
								/>
							) :
							(
								<div className='text-sm font-medium flex items-center border-[1.5px] border-[var(--grayscale-80)] rounded-lg bg-[var(--grayscale-20)]'>
									<RangePicker
										value={[dates[0], dates[1]]}
										allowClear={false}
										format="YYYY-MM-DD"
										separator={' - '}
										onChange={(dates) => {
											if (dates) {
												setDates(dates as Moment[]);
											}
										}}
										suffixIcon={false}
										className="u6-range-picker !border-0"
										style={datePickerStyle}
										disabledDate={(current) => current > max}
									/>
									<img className='w-6 h-6 mr-4' src={`assets/${environment.uVersion}/Calendar.png`} alt="icon_calendar" />
								</div>
							)
					}
				</section>

				<div>
					{
						isMobile
							? <MobilePage />
							: (
								<Table
									columns={columns || []}
									dataSource={records}
									dataCount={dataCount}
									currentPage={currentPage!}
									pageSize={pageSize!}
									pages={pages!}
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
