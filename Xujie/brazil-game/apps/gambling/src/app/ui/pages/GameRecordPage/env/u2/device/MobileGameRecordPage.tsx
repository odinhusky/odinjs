import { IGameRecordPageProps } from "../../../index";
import { BackNavigation } from "../../../../../components-bs/BackNavigation/BackNavigation";
import { usePageNavigate } from "../../../../../router/hooks/usePageNavigate";
import RangeDatePicker from "../../../../../components-bs/DatePickers/RangeDatePicker";
import moment from "moment";
import { formatLocaleMoney } from "../../../../../utils/format";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import { environment } from "../../../../../../../environments/environment";
import {PageContainer} from "../../../../../components-bs/PageContainer";

const BottomLine = styled.div`
 height: 1px;
 background: linear-gradient(90deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.20) 49.48%, rgba(255, 255, 255, 0.00) 100%);
`


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

  return (
    <PageContainer className='flex flex-col h-full'>

      <BackNavigation onClick={onClickToIndex} />

      <RangeDatePicker
        min='2023-01-01'
        max={max.format('YYYY-MM-DD')}
        onConfirm={(values) => setDates([moment(values[0], 'YYYY-MM-DD'), moment(values[1], 'YYYY-MM-DD')])}
        value={[dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')]}
      />

      <div className='relative grow h-full mt-3 mb-10'>
        <div
          ref={wrapperRef}
          className='absolute top-0 bottom-0 flex flex-col rounded-lg w-full bg-[var(--grayscale-20)] p-2 overflow-y-scroll'
          onScroll={handleOnScroll}
        >
          {
            records.map((record) => (
              <div
                key={record.roomId}
                className='bg-[#262626] w-full rounded-lg p-2 text-sm text-[var(--grayscale-70)] mb-[10px] border border-[var(--grayscale-30)]'
              >
                <div className='w-full flex justify-between pb-2'>
                  <div>Nome Do Jogo</div>
                  <div className='text-[var(--grayscale-100)]'>{record.gameName}</div>
                </div>
                <BottomLine />
                <div className='w-full flex justify-between py-2'>
                  <div>Tempo</div>
                  <div className='text-[var(--grayscale-100)]'>{moment(record.createTime).format('DD.MM.YYYY HH:mm:ss')}</div>
                </div>
                <BottomLine />
                <div className='w-full flex justify-between py-2'>
                  <div>Valor Da Aposta</div>
                  <div className='text-[var(--grayscale-100)]'>R$ {formatLocaleMoney(record.bet / 100)}</div>
                </div>
                <BottomLine />
                <div className='w-full flex justify-between pt-2'>
                  <div>Lucro</div>
                  <div className='text-[var(--grayscale-100)]'>{formatLocaleMoney(record.win / 100)}</div>
                </div>
              </div>
            ))
          }
          {
            records.length === 0 && (
              <div className="grow border-dashed border-[var(--grayscale-70)] flex flex-col justify-center w-full items-center border-2 rounded-lg">
                <img className={'h-[64px] mb-2'} alt="NoData" src={`assets/${environment.uVersion}/noData.png`} />
                <div className='text-sm font-normal text-[var(--grayscale-70)]'>Nada aqui</div>
              </div>
            )
          }
        </div>
      </div>

      {/*<div*/}
      {/*  ref={wrapperRef}*/}
      {/*  className='flex flex-col mb-5 mt-3 rounded-lg w-full bg-[#333333] p-2 overflow-y-scroll'*/}
      {/*  onScroll={handleOnScroll}*/}
      {/*>*/}
      {/*  {*/}
      {/*    records.map((record) => (*/}
      {/*      <div*/}
      {/*        key={record.roomId}*/}
      {/*        className='bg-[#262626] w-full rounded-lg p-2 text-sm text-[var(--grayscale-70)] mb-[10px] border border-[var(--grayscale-30)]'*/}
      {/*      >*/}
      {/*        <div className='w-full flex justify-between pb-2'>*/}
      {/*          <div>Nome Do Jogo</div>*/}
      {/*          <div>{record.gameName}</div>*/}
      {/*        </div>*/}
      {/*        <BottomLine />*/}
      {/*        <div className='w-full flex justify-between py-2'>*/}
      {/*          <div>Tempo</div>*/}
      {/*          <div>{moment(record.createTime).format('DD.MM.YYYY HH:mm:ss')}</div>*/}
      {/*        </div>*/}
      {/*        <BottomLine />*/}
      {/*        <div className='w-full flex justify-between py-2'>*/}
      {/*          <div>Valor Da Aposta</div>*/}
      {/*          <div>R$ {formatLocaleMoney(record.bet / 100)}</div>*/}
      {/*        </div>*/}
      {/*        <BottomLine />*/}
      {/*        <div className='w-full flex justify-between pt-2'>*/}
      {/*          <div>Lucro</div>*/}
      {/*          <div>{formatLocaleMoney(record.win / 100)}</div>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    ))*/}
      {/*  }*/}
      {/*  {*/}
      {/*    records.length === 0 && (*/}
      {/*      <div className="grow border-dashed border-[var(--grayscale-70)] flex flex-col justify-center w-full items-center border-2 rounded-lg">*/}
      {/*        <img className={'h-[64px] mb-2'} alt="NoData" src={`assets/${environment.assetPrefix}/noData.png`} />*/}
      {/*        <div className='text-sm font-normal text-[var(--grayscale-70)]'>Nada aqui</div>*/}
      {/*      </div>*/}
      {/*    )*/}
      {/*  }*/}
      {/*</div>*/}
    </PageContainer>
  )
}
