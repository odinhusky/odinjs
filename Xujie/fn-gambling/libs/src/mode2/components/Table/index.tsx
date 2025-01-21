import React, {
  ReactNode,
  RefObject,
  isValidElement,
  useEffect,
  useRef,
} from 'react';
import cx from '@commonUtils/cx';
import { useTranslation } from 'react-i18next';
export { useTable } from './useTable';
/**
 * 定义了一个泛型类型 ITableColumn，用于描述无限表格的列属性
 * T 是泛型参数，表示该列数据对象的类型
 */
export interface ITableColumn<T> {
  /**
   * 列的宽度，可选
   */
  width?: string;
  /**
   * 列的标题，必填，string 為 i18next 的 key
   */
  title: string | JSX.Element;
  /**
   * 数据对象中用于获取列数据的键名，必填
   */
  dataIndex: keyof T;
  /**
   * 渲染列数据的函数，可选
   * 接收三个参数：record（当前行的数据对象）、indexRow（行索引）、indexCol（列索引）
   * 返回一个 React 节点或字符串作为单元格内容
   */
  render?: (
    record: T,
    indexRow?: number,
    indexCol?: number
  ) => React.ReactNode | string;
  /**
   * 權重最大的樣式
   */
  className?: string;
}

/**
 * ModeTable组件的属性接口定义。
 * T代表表格中每行数据的类型，是一个泛型参数。
 */
export interface ITableProps<T> {
  /**
   * 表格自定义类名，可选。
   */
  /**
   * 列的 CSS 类名，可选
   */
  classNames?: {
    table?: string;
    thead?: string;
    theadTr?: string;
    theadTth?: string;
    tbody?: string;
    tbodyTr?: string;
    tbodyTd?: string;
  };
  /**
   * 每一行数据的唯一标识，可以是对象T的一个属性名，或者多个属性名组成的数组。
   */
  rowKey: keyof T | (keyof T)[];
  /**
   * 表格的数据源，是一个泛型T的数组。
   */
  dataSource: T[];
  /**
   * 定义表格的列信息，包括列标题、渲染方式等。
   */
  columns: ITableColumn<T>[];
  /**
   * 当滚动到底部时，触发的数据获取函数，可选。
   */
  fetchData?: () => void;
  /**
   * 数据总量。
   */
  totalCount?: number;

  /**
   * 每页显示多少条数据，可选。
   */
  pageSize?: number;
  /**
   * table tbody ref，可选。
   */
  tbodyRef?: RefObject<HTMLTableSectionElement>;
  isFinish?: boolean;
  btnClassName?: {
    btnClass?: string;
    textClass?: string;
    iconClass?: string;
    iconColor?: string;
  };
  noData?: ReactNode;
}

/**
 * 表格组件
 *
 * @template T 表格数据项的类型
 * @param props 组件属性
 * @returns 渲染后的表格组件
 */
const ModeTable = <T,>({
  columns,
  dataSource,
  pageSize = 30,
  classNames = {
    table: '',
    thead: '',
    theadTr: '',
    theadTth: '',
    tbody: '',
    tbodyTr: '',
    tbodyTd: '',
  },
  rowKey,
  fetchData,
  totalCount = dataSource.length,
  tbodyRef = useRef<HTMLTableSectionElement>(null),
  noData = <>noData</>,
}: ITableProps<T>) => {
  const { t } = useTranslation();
  const handleOnScroll = (e: React.UIEvent<HTMLTableSectionElement>) => {
    const bottom =
      e.currentTarget.scrollHeight -
      e.currentTarget.scrollTop -
      e.currentTarget.clientHeight;
    if (bottom < pageSize) {
      fetchData && fetchData();
    }
  };
  useEffect(() => {
    if (tbodyRef.current?.scrollHeight !== undefined) {
      const scrollbarVisible =
        tbodyRef.current.scrollHeight > tbodyRef.current.clientHeight;

      if (
        !scrollbarVisible &&
        Number(totalCount) - Number(dataSource.length) > 700
      ) {
        fetchData && fetchData();
      }
    }
  }, [dataSource]);

  return dataSource.length === 0 ? (
    <div className="mx-auto">{noData}</div>
  ) : (
    <>
      <table className={cx('mode-table', classNames.table)}>
        <thead className={cx('table-thead', classNames.thead)}>
          <tr className={cx('table-thead-tr', classNames.theadTr)}>
            {columns.map((col, index) => (
              <th
                key={col.title + index.toString()}
                className={cx(
                  'table-thead-th',
                  classNames.theadTth,
                  col?.className
                )}
              >
                {isValidElement(col.title) ? col.title : t(col.title as string)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody
          className={cx('table-tbody', classNames.tbody)}
          ref={tbodyRef}
          onScroll={handleOnScroll}
        >
          {dataSource.map((data, dataIndex) => {
            const trKey = Array.isArray(rowKey)
              ? rowKey.reduce((acc, cur) => `${acc} - ${data[cur]}`, '')
              : data[rowKey];

            return (
              <tr
                key={trKey as string}
                className={cx('table-tbody-tr', classNames.tbodyTr)}
              >
                {columns.map((col, index) => (
                  <td
                    key={col.dataIndex.toString() + index.toString()}
                    className={cx(
                      'table-tbody-td text-nowrap',
                      classNames.tbodyTd
                    )}
                  >
                    {col.render
                      ? col.render(data, dataIndex, index)
                      : (data[col.dataIndex] as ReactNode)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
export default ModeTable;
