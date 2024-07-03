import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import { datePickerStyle } from "../../../../components-bs/DatePickers/DatePicker";
import { ReactNode, useEffect, useRef } from 'react';
import cx from '../../../../utils/cx';
// import "./index.scss";
import { DatePicker } from 'antd';
import { IGameRecordPageProps } from "../../index";
import { BackNavigation } from "../../../../components-bs/BackNavigation/BackNavigation";
import { usePageNavigate } from "../../../../router/hooks/usePageNavigate";
import moment, { Moment } from "moment";
import { environment } from "../../../../../../environments/environment";
import { formatLocaleMoney } from "../../../../utils/format";
import { PageContainer } from "../../../../components-bs/PageContainer";
import { InfiniteTable, TInfiniteTableColumn } from '../../../../components-bs/InfiniteTable';
import { GetUserGameRecordResponse } from 'apps/gambling/src/app/external';
import BaseNoData from "../../../../components-bs/BaseNoData/BaseNoData";
import { InfiniteHorizontalTable } from "../../../../components-bs/InfiniteHorizontalTable";

const { RangePicker } = DatePicker;

type TGameRecordItem = GetUserGameRecordResponse['rows'][number]

/**
 * 遊戲記錄頁面
 */
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

  const { isMobile, isDesktop } = useBreakpoint();

  const max = moment();

  const { onClickToIndex } = usePageNavigate();

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
    else if (handleFetchData !== undefined && records && records.length < 15 &&
      (Number(dataCount) - Number(records.length) > 0)
    ) {
      handleFetchData();
    }
  }, [records])



  const columns: TInfiniteTableColumn<TGameRecordItem>[] = [
    {
      title: 'Nome Do Jogo',
      dataIndex: 'gameName',
      render: (record) => (
        <div className={cx('flex gap-2 items-center', isMobile ? 'justify-end' : 'pl-2 justify-start')}>
          <img
            alt='gameLogo'
            className={cx('w-10 rounded object-cover', isMobile ? 'hidden' : null)}
            src={`${environment.s3URLImages}/${record.gameId}-small.png`}
          />
          <span>
            {record.gameName}
          </span>
        </div>
      ),
      thClassName: 'font-medium'
    },
    {
      title: 'Tempo',
      dataIndex: 'createTime',
      render: (record) => (
        `${moment(record.createTime).format('DD.MM.YYYY HH:mm:ss')}`
      ),
      thClassName: 'font-medium'
    },
    {
      title: 'Valor Da Aposta',
      dataIndex: 'bet',
      render: (record) => `R$ ${formatLocaleMoney(record.bet / 100)}`,
      thClassName: 'font-medium'
    },
    {
      title: 'Lucro',
      dataIndex: 'win',
      render: (record) => formatLocaleMoney(record.win / 100),
      thClassName: 'font-medium'
    }
  ]

  return (
    <PageContainer>
      <BackNavigation onClick={onClickToIndex} title={"Retornar"} />
      <div className='w-full mt-5 tablet:mt-8 box-border'>
        <div className='mb-5 text-sm font-bold flex justify-start text-center'>
          <RangePicker
            value={[dates[0], dates[1]]}
            allowClear={false}
            format="YYYY-MM-DD"
            separator={'-'}
            onChange={(dates) => {
              if (dates) {
                setDates(dates as Moment[]);
              }
            }}
            suffixIcon={false}
            className="bg-[var(--grayscale-15)] hover:bg-[var(--grayscale-30)] focus-within:bg-[var(--grayscale-20)] focus-within:shadow-none before:translate-y-0.5 before:mr-2 before:content-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADkSURBVHgBrZWNDYIwEIWvTIAb1A3cxG5QNtANYAMcQSdgFEaoG+gG552p4UfoXQlf8mjSvHsh16MALICIJakidaSAA33c86CFzI70QpkgBpPhhvk0a2ENbqedh1VCwYV0FTyOs0wMDLTYRDds9IaE5006Fvx2QpiWknQu+AH74TjQwn6cDHdTYbQg9/BLAToOxpgnrQ/RidNPaw322Oi/J3w9GzrUERShnWaoc0L972bRXAaT0Fg32R/30WEeAf9b5eeH0+J26rUTrzGfVhqjCnWjxH13oAWHX0A/Cglxz5PKpboPs8FL0YwrZ74AAAAASUVORK5CYII=')]"
            style={datePickerStyle}
            disabledDate={(current) => current > max}
          />
        </div>

        {
          isMobile ?
            <InfiniteHorizontalTable
              columnKey='createTime'
              className='h-[336px]'
              headerClassName=''
              rowClassName=''
              datasource={records || []}
              rows={columns}
              totalCount={records.length || 0}
              fetchData={handleFetchData}
            />
            :
            <div 
              className='w-full h-[684px] rounded-lg text-xs tablet:text-sm text-[var(--grayscale-100)] text-center border-stroke-popup relative shadow-[0_4px_4px_rgba(0,0,0,0.25)] '/** */
            >
              <InfiniteTable<TGameRecordItem>
                className='bg-linear-4-main'
                headerClassName='bg-[var(--transparent-black-10)] text-[var(--grayscale-80)] font-medium'
                rowKey='createTime'
                datasource={records || []}
                columns={columns}
                totalCount={dataCount || 0}
                fetchData={handleFetchData}
              />
              {
                !records || records.length === 0 ? null :
                  <div className="pointer-events-none w-full h-full absolute top-0 left-0 flex justify-between">
                    <span className="h-full w-[0.5px] bg-inherit"></span>
                    {
                      Array.from({ length: columns.length - 1 }, () => null).map((c, index) => (
                        <span key={index} className="h-full w-[0.5px] bg-[var(--transparent-white-5)]"></span>
                      ))
                    }
                    <span className="h-full w-[0.5px] bg-inherit"></span>
                  </div>
              }
            </div>
        }

      </div>
    </PageContainer>
  )
}
