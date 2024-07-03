import { IGameRecordPageProps } from "../../../index";
import { BackNavigation } from "../../../../../components-bs/BackNavigation/BackNavigation";
import { usePageNavigate } from "../../../../../router/hooks/usePageNavigate";
import RangeDatePicker from "../../../../../components-bs/DatePickers/RangeDatePicker";
import moment from "moment";
import { ReactNode, useEffect, useMemo, useRef } from "react";
import { PageContainer } from "../../../../../components-bs/PageContainer";
import { formatLocaleMoney } from "apps/gambling/src/app/ui/utils/format";
import { NoData } from "../../../../../components-bs/Table/env/u5/NoData";



const TableItem = ({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) => {
  return (
    <div
      className={`pl-3 h-14 text-xs flex items-center border-b border-r text-white box-border ${className}`}
    >
      {children}
    </div>
  )
}

export const MobileGameRecordPage = ({
  dates,
  setDates,
  records,
  handleFetchData,
  dataCount
}: IGameRecordPageProps) => {

  const wrapperRef = useRef<HTMLDivElement>(null)

  const max = moment();

  const { onClickToIndex } = usePageNavigate();

  const handleOnScroll = (e: any) => {
    const right = e.target.scrollWidth - e.target.scrollLeft - e.target.clientWidth;

    if (right <= 30 && handleFetchData !== undefined) {
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
      title: "Nome Do Jogo",
      render: (record: any) => `${record.gameName}`,
    },
    {
      title: "Tempo",
      render: (record: any) => (
        <div>
          <span>{moment(record.createTime).format('DD.MM.YYYY')} </span><br />
          <span>{moment(record.createTime).format('HH:mm:ss')} </span>
        </div>
      ),
    },
    {
      title: "Valor Da Aposta",
      render: (record: any) => `R$ ${formatLocaleMoney(record.bet / 100)}`,
    },
    {
      title: "Lucro",
      render: (record: any) => `${formatLocaleMoney(record.win / 100)}`,
    },
  ]
  const bodyRef = useRef<HTMLDivElement>(null)
  const isWidthFull = useMemo(() => {
    if (bodyRef.current) {
      const maxNum = bodyRef.current.clientWidth / 150
      return records?.length > maxNum
    }
    return false
  }, [records])

  return (
    <PageContainer className='flex flex-col h-full'>

      <BackNavigation onClick={onClickToIndex} className="text-base font-bold" />

      <div className="p-4 mt-4 rounded-lg box-border bg-[var(--grayscale-20)]">
        <div className="flex justify-center">
          <RangeDatePicker
            min='2023-01-01'
            max={max.format('YYYY-MM-DD')}
            onConfirm={(values) => setDates([moment(values[0], 'YYYY-MM-DD'), moment(values[1], 'YYYY-MM-DD')])}
            value={[dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')]}
            className="bg-[var(--grayscale-100)]"
          />
        </div>

        <div className={`w-full rounded-lg bg-[var(--grayscale-15)]`}>
          <div className="flex flex-col bg-[var(--grayscale-20)] rounded-lg mt-4 text-white overflow-hidden">
            <div className={`w-full rounded-lg flex bg-[var(--grayscale-15)]`}>
              <div className={`flex flex-1 overflow-x-auto`} ref={bodyRef} onScroll={handleOnScroll}>
                <div className="flex-shrink-0" style={{ width: "80px" }}>
                  {columns.map((item, index) =>
                    <TableItem key={item.title}
                      className={`font-bold border-[var(--grayscale-20)] ${index == 0 ? 'rounded-tl-lg' : ''} bg-linear-2-disabled]`}
                    >
                      {item.title}{index}
                    </TableItem>
                  )}
                </div>
                {
                  records.length ? <>
                    {records.map((record: any, i) => (
                      <div key={i}
                        className={`flex flex-col ${isWidthFull ? "w-[150px] flex-shrink-0" : "flex-1"}`}
                      >
                        {columns.map((item, index) =>
                          <TableItem key={index} className="w-[150px] border-[var(--grayscale-30)]">{item.render(record)}</TableItem>
                        )}
                      </div>
                    ))}</> : <NoData className="w-full !py-1" imgClassName="!w-[112px] h-[120px]" />
                }
              </div>

            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
