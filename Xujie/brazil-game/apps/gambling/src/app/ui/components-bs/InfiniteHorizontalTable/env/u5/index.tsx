import {IUVersionInfiniteHorizontalTableProps} from "../../index";
import {twMerge} from "tailwind-merge";
import React, {ReactNode} from "react";
import {environment} from "../../../../../../environments/environment";


const InfiniteHorizontalTable = <T, >({
  rowClassName,
  className,
  headerClassName,
  rows,
  columnKey,
  tbodyRef,
  handleOnScroll,
  datasource,
  bodyClassName,
  isSuccess
}: IUVersionInfiniteHorizontalTableProps<T>) => {

  const showNoData = isSuccess === undefined ? true: isSuccess

  return (
    <div
      className={
        twMerge(
          'overflow-hidden w-full flex',
          className
        )
      }
    >
      <div>
        {
          rows.map((row, index) => (
            <div
              key={index}
              className={
                twMerge(
                  'flex justify-start items-center h-full break-words px-3 font-bold w-[150px] h-10 bg-linear-5-disabled',
                  index !== rows.length - 1 && 'border-b border-[var(--transparente-20)]',
                  headerClassName,
                  row.className && row.className
                )
              }
            >
              {row.title}
            </div>
          ) )
        }
      </div>

      <div
        className={
          twMerge(
            'w-full overflow-y-hidden flex overflow-x-scroll bg-[var(--grayscale-15)]',
            bodyClassName
          )
        }
        onScroll={handleOnScroll}
        ref={tbodyRef}
      >
        {
          datasource.map((data) => (
            <div
              key={String(data[columnKey])}
              className='flex-shrink-0'
            >
              {
                rows.map((row, index) => (
                  <div
                    key={row.dataIndex.toString() + index.toString()}
                    className={twMerge(
                      'px-2 h-10 flex justify-center items-center border-r border-[var(--grayscale-30)] break-words',
                      index !== rows.length - 1 && 'border-b',
                      row.className && row.className,
                      rowClassName
                    )}
                  >
                    {
                      row.render && row.render(data)
                    }
                    {
                      !row.render && data[row.dataIndex] as ReactNode
                    }
                  </div>
                ))
              }
            </div>
          ))
        }

        {
          datasource.length === 0 && showNoData && (
            <div
              className='w-full h-full flex flex-col gap-3 justify-center items-center'
            >
              <img
                className='w-[120px]'
                alt='noData'
                src={`assets/${environment.uVersion}/noData.png`}
              />

              <div className='text-white font-bold text-base w-full text-center'>
                Nada aqui
              </div>
            </div>
          )
        }
      </div>

    </div>
  )
}


export default InfiniteHorizontalTable