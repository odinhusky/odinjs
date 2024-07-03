import { IUVersionInfiniteHorizontalTableProps } from "../../index";
import React, { ReactNode } from "react";
import { environment } from "../../../../../../environments/environment";
import cx from "../../../../utils/cx";
import BaseNoData from "../../../BaseNoData/BaseNoData";


const InfiniteHorizontalTable = <T,>({
  rowClassName,
  className,
  headerClassName,
  rows,
  columnKey,
  tbodyRef,
  handleOnScroll,
  datasource,
  bodyClassName
}: IUVersionInfiniteHorizontalTableProps<T>) => {

  // const showNoData = isSuccess === undefined ? true : isSuccess

  return (
    <div
      className={cx(
        'w-full h-full overflow-y-scroll grow',
        className
      )}
      onScroll={handleOnScroll}
      ref={tbodyRef}
    >
      {
        datasource.length ? <>
          {datasource.map((record: any, i) => (
            <div key={columnKey && record[columnKey] ? record[columnKey] : i}
              className={
                cx(
                  'w-full mb-2 rounded-lg border-stroke-popup shadow-[inset_0_0_8px_rgba(0,0,0,0.25)]'
                )
              }
            >
              <table className={cx("w-full rounded-lg bg-linear-4-main text-xs")}>
                <tbody className={cx("w-full", bodyClassName)}>
                  {rows.map((item, index) =>
                    <tr key={item.dataIndex.toString() + index.toString()}
                      className={cx('flex justify-between items-center w-full p-2', rowClassName)}
                    >
                      <td className={cx('text-start text-[var(--transparent-white-70)]', headerClassName, item.className)}>{item.title}</td>
                      <td className={cx('text-end text-[var(--grayscale-100)]', item.className)}>
                        {item.render ? item.render(record) : record[item.dataIndex]}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ))}</> :
          <div className={"w-full h-full text-[var(--grayscale-100)] rounded-lg border-stroke-popup shadow-[inset_0_0_8px_rgba(0,0,0,0.25)]"}>
            <div className="bg-linear-4-main flex justify-center items-center">
              <BaseNoData />
            </div>
          </div>
      }

    </div>
  )
}


export default InfiniteHorizontalTable