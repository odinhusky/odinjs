import { IInfiniteTableProps, IUVersionInfiniteTableProps } from "../../index";
import React, { ReactNode, RefObject, UIEventHandler } from "react";
import cx from "../../../../utils/cx";
import BaseNoData from "../../../BaseNoData/BaseNoData";
import { FLEX_CENTER } from "apps/gambling/src/assets/constant/style";
import { isArray } from "lodash";

const InfiniteTable = <T,>({
  className,
  headerClassName,
  columns,
  datasource,
  rowKey,
  tbodyRef,
  handleOnScroll,
  isSuccess,
  tbodyClassName = "",
  tbodyTrClassName = "",
  isShowLastBorder = true,
}: IUVersionInfiniteTableProps<T>) => {
  const showNoData = isSuccess === undefined ? true : isSuccess;
  // console.log("datasource", datasource);

  return (
    <table
      className={cx(
        "w-full rounded-lg overflow-hidden h-full flex flex-col",
        className
      )}
    >
      <thead className={cx("flex justify-between w-full", headerClassName)}>
        <tr className="flex w-full">
          {columns.map((col, index) => (
            <th
              key={col.title + index.toString()}
              className={cx(
                "text-center py-[10px] w-full",
                FLEX_CENTER,
                col.className,
                col.thClassName
              )}
            >
              {col.renderTitle && col.renderTitle()}
              {!col.renderTitle && col.title}
            </th>
          ))}
        </tr>
      </thead>

      <tbody
        className={cx(
          "overflow-y-scroll grow",
          datasource.length === 0 &&
            "flex flex-col justify-center items-center",
          tbodyClassName
        )}
        onScroll={handleOnScroll}
        ref={tbodyRef}
      >
        {datasource.map((data, dataIndex) => {
          const trKey = isArray(rowKey)
            ? rowKey.reduce((acc, cur) => `${acc} - ${data[cur]}`, "")
            : data[rowKey];

          return (
            <tr
              key={trKey as string}
              className={cx("flex", "w-full", tbodyTrClassName, {
                "border-0":
                  !isShowLastBorder && dataIndex === datasource.length - 1,
              })}
            >
              {columns.map((col, index) => (
                <td
                  key={col.dataIndex.toString() + index.toString()}
                  className={cx("w-full", FLEX_CENTER, col.className, col.tdClassName)}
                >
                  {col.render && (
                    <div
                      className={cx(
                        "py-2 flex justify-center items-center",
                        col.renderClassName
                      )}
                    >
                      {col.render(data)}
                    </div>
                  )}
                  {!col.render && (
                    <div className="py-2 flex justify-center items-center">
                      {data[col.dataIndex] as ReactNode}
                    </div>
                  )}
                </td>
              ))}
            </tr>
          );
        })}
        {datasource.length === 0 && showNoData ? <BaseNoData /> : null}
      </tbody>
    </table>
  );
};

export default InfiniteTable;
