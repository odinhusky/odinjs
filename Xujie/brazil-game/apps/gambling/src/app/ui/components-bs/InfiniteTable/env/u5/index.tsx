import {IInfiniteTableProps, IUVersionInfiniteTableProps} from "../../index";
import React, { ReactNode, RefObject, UIEventHandler } from "react";
import { environment } from "../../../../../../environments/environment";
import { isArray } from "lodash";
import cx from "../../../../utils/cx";


const InfiniteTable = <T,>({
  className,
  headerClassName,
  columns,
  datasource,
  rowKey,
  tbodyRef,
  handleOnScroll,
  isSuccess,
  tbodyClassName = '',
  tbodyTrClassName = '',
  isShowLastBorder = true,
  noDataImgClass = ''
}: IUVersionInfiniteTableProps<T>) => {

  const showNoData = isSuccess === undefined ? true: isSuccess

  return (
    <table className={cx(
      'w-full rounded-lg overflow-hidden h-full flex flex-col',
      className
      )}
    >
      <thead className={cx('flex justify-between bg-linear-5-disabled w-full', headerClassName)}>
        {
          columns.map((col, index) => (
            <th
              key={index}
              className={
                cx(
                  'text-center py-[10px] font-bold w-full flex justify-center items-center',
                  col.className,
                  col.thClassName,
                )
              }
            >
              {col.title}
            </th>
          ))
        }
      </thead>

      <tbody
        className={cx(
          'bg-[var(--grayscale-15)] overflow-y-scroll grow',
          datasource.length === 0 && 'flex flex-col justify-center items-center',
          tbodyClassName
        )}
        onScroll={handleOnScroll}
        ref={tbodyRef}
      >
        {
          datasource.map((data, dataIndex) => { 
            const trKey = isArray(rowKey) 
              ? rowKey.reduce((acc, cur) => `${acc} - ${data[cur]}`, '')
              : data[rowKey];

            return (
              <tr
                key={trKey as string}
                className={cx(
                  'flex',
                  'border-b border-[var(--grayscale-20)]', 'w-full',
                  tbodyTrClassName,
                  {'border-0': !isShowLastBorder && dataIndex === (datasource.length - 1)}
                )}
              >
                {
                  columns.map((col, index) => (
                    <td
                      key={col.dataIndex.toString() + index.toString()}
                      className={
                        cx(
                          'flex justify-center w-full',
                          col.className,
                          col.tdClassName,
                        )
                      }
                    >
                      {
                        col.render && (
                          <div className='py-[10px] flex'>
                            {col.render(data, dataIndex)}
                          </div>
                        )
                      }
                      {
                        !col.render && (
                          <div
                            className='py-[10px] flex'
                          >
                            {data[col.dataIndex] as ReactNode}
                          </div>
                        )
                      }
                    </td>
                  ))
                }
              </tr>
            )
        })
        }
        {
          datasource.length === 0 && showNoData && (
            <div className='flex flex-col gap-3'>
              <img
                className={cx(
                  'w-[225px]',
                  noDataImgClass
                )}
                alt='noData'
                src={`assets/${environment.uVersion}/noData.png`}
              />

              <div className='text-white font-bold text-base w-full text-center'>
                Nada aqui
              </div>
            </div>
          )
        }
      </tbody>
    </table>
  )
}

export default InfiniteTable
