import {IUVersionInfiniteTableProps} from "../../index";
import cx from "../../../../utils/cx";
import {ReactNode} from "react";
import {environment} from "../../../../../../environments/environment";
import { isArray } from "lodash";

const InfiniteTable = <T,>({
  className,
  headerClassName,
  columns,
  datasource,
  rowKey,
  tbodyRef,
  tbodyClassName,
  handleOnScroll,
  isSuccess,
  tbodyTrClassName = '',
  isShowLastBorder = true,
  noDataImgClass = ''
}: IUVersionInfiniteTableProps<T>) => {

  const showNoData = isSuccess === undefined ? true: isSuccess

  return (
    <table
      className={
        cx(
          'w-full rounded-xl overflow-hidden h-full flex flex-col',
          className
        )
      }
    >
      <thead
        className={
          cx(
            'flex bg-[var(--primary-variant)] justify-between',
            headerClassName
          )
        }
      >
      {
        columns.map((col, index) => (
          <th
            key={index}
            className={
              cx(
                'text-center py-[10px] font-bold w-full flex justify-center items-center',
                index !== columns.length -1 && 'border-r border-[var(--white-60)]',
                col.className,
                col.thClassName,
              )
            }
            style={{
              width: col.width,
              flexShrink: col.width ? 0: undefined
            }}
          >
            {col.title}
          </th>
        ))
      }
      </thead>

      <tbody
        className={
          cx(
            'overflow-y-scroll grow',
            datasource.length === 0 && 'flex flex-col justify-center items-center',
            tbodyClassName
          )
        }
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
                'w-full',
                'odd:bg-[var(--primary-assistant-20)] even:bg-[var(--white-20)]',
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
                        'w-full flex justify-center items-center',
                        index !== columns.length -1 && 'border-r border-[var(--white-20)]',
                        col.className,
                        col.tdClassName,
                      )
                    }
                    style={{
                      width: col.width,
                      flexShrink: col.width ? 0: undefined
                    }}
                  >
                    {
                      col.render ?
                        (<div
                          className='py-[10px] flex'
                        >
                          {col.render(data)}
                        </div>):
                        (<div
                          className='py-[10px] flex'
                        >
                          {data[col.dataIndex] as ReactNode}
                        </div>)
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
          <div
            className='flex flex-col gap-1 bg-[var(--primary-assistant-20)] w-full h-full justify-center items-center'
          >
            <img
              className={cx(
                'w-[76px]',
                noDataImgClass
              )}
              alt='noData'
              src={`assets/${environment.uVersion}/noData.png`}
            />

            <div
              className='font-bold text-base w-full text-center'
            >
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