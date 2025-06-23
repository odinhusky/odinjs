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
  /**
   * 没有数据的时候是否显示thead 默认不显示
   * 以往沒有數據時, 整個table都會none，[IN][V6]沒有數據時也需要顯示thead
   * @default false
   */
  isShowThead?: boolean;
  isLoading?: boolean;
  skeleton?: ReactNode;
}

/**
 * 表格组件
 *
 * @template T 表格数据项的类型
 * @param props 组件属性
 * @returns 渲染后的表格组件
 */
export const ModeTable = <T,>({
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
  isShowThead = false,
  isLoading = false,
  skeleton = <></>,
}: ITableProps<T>) => {
  const { t } = useTranslation();

  const loadingRef = useRef(false);

  const handleOnScroll = (e: React.UIEvent<HTMLTableSectionElement>) => {
    if (loadingRef.current || isLoading) return;

    const bottom =
      e.currentTarget.scrollHeight -
      e.currentTarget.scrollTop -
      e.currentTarget.clientHeight;
    if (bottom < pageSize) {
      loadingRef.current = true;

      fetchData && fetchData();
    }
  };
  useEffect(() => {
    if (!isLoading) {
      loadingRef.current = false;
    }
  }, [isLoading]);
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

  return dataSource.length === 0 && !isShowThead ? (
    <div className="mx-auto">{noData}</div>
  ) : (
    <>
      <div className={cx('mode-table', classNames.table)}>
        <div className={cx('table-thead', classNames.thead)}>
          <div className={cx('table-thead-tr', classNames.theadTr)}>
            {columns.map((col, index) => (
              <div
                key={col.title + index.toString()}
                className={cx(
                  'table-thead-th',
                  classNames.theadTth,
                  col?.className
                )}
              >
                {isValidElement(col.title) ? col.title : t(col.title as string)}
              </div>
            ))}
          </div>
        </div>

        <div
          className={cx('table-tbody', classNames.tbody)}
          ref={tbodyRef}
          onScroll={handleOnScroll}
        >
          {dataSource.map((data, dataIndex) => {
            const trKey = Array.isArray(rowKey)
              ? rowKey.reduce((acc, cur) => `${acc} - ${data[cur]}`, '')
              : data[rowKey];

            return (
              <div
                key={String(trKey) + Math.random() + new Date().getTime()}
                className={cx('table-tbody-tr', classNames.tbodyTr)}
              >
                {columns.map((col, index) => (
                  <div
                    key={col.dataIndex.toString() + index.toString()}
                    className={cx(
                      'table-tbody-td text-nowrap',
                      classNames.tbodyTd
                    )}
                  >
                    {col.render
                      ? col.render(data, dataIndex, index)
                      : (data[col.dataIndex] as ReactNode)}
                  </div>
                ))}
              </div>
            );
          })}

          {isLoading ? <div>{skeleton}</div> : null}

          {!isLoading && isShowThead && dataSource.length === 0 ? (
            <div className="mx-auto">{noData}</div>
          ) : null}
        </div>
      </div>
    </>
  );
};
export default ModeTable;
