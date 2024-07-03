import { default as U5InfiniteTable } from './env/u5';
import { default as U6InfiniteTable } from './env/u6';
import { default as U1InfiniteTable } from './env/u1';
import { default as P1InfiniteTable } from './env/p1';
import { default as U7InfiniteTable } from './env/u7';

import { renderByUVersion } from '../../utils/renderByUVersion';
import React, { RefObject, useEffect, useRef } from 'react';

export type TInfiniteTableColumn<T> = {
  className?: string;
  thClassName?: string;
  tdClassName?: string;
  width?: string;
  title: string;
  renderTitle?: () => React.ReactNode | string;
  dataIndex: keyof T;
  render?: (record: T, dataIndex?: number) => React.ReactNode | string;
  renderClassName?: string;
};

export interface IInfiniteTableProps<T> {
  headerClassName?: string;
  rowClassName?: string;
  rowKey: keyof T | (keyof T)[];
  className?: string;
  datasource: T[];
  columns: TInfiniteTableColumn<T>[];
  fetchData?: () => void;
  totalCount: number;
  isSuccess?: boolean;
  tbodyClassName?: string;
  tbodyTrClassName?: string;
  isShowLastBorder?: boolean;
  noDataImgClass?: string;
}

export interface IUVersionInfiniteTableProps<T> extends IInfiniteTableProps<T> {
  tbodyRef: RefObject<HTMLTableSectionElement>;
  handleOnScroll: (e: React.UIEvent<HTMLTableSectionElement>) => void;
}

export const InfiniteTable = <T,>(props: IInfiniteTableProps<T>) => {
  const tbodyRef = useRef<HTMLTableSectionElement>(null);

  const handleOnScroll = (e: React.UIEvent<HTMLTableSectionElement>) => {
    const bottom =
      e.currentTarget.scrollHeight -
      e.currentTarget.scrollTop -
      e.currentTarget.clientHeight;
    if (bottom < 30) {
      props.fetchData && props.fetchData();
    }
  };
  // console.log("fetchData", props.fetchData);

  useEffect(() => {
    if (tbodyRef.current?.scrollHeight !== undefined) {
      const scrollbarVisible =
        tbodyRef.current.scrollHeight > tbodyRef.current.clientHeight;

      if (
        !scrollbarVisible &&
        Number(props.totalCount) - Number(props.datasource.length) > 700
      ) {
        props.fetchData && props.fetchData();
      }
    }
  }, [props.datasource]);

  return renderByUVersion(
    {
      p1: (
        <P1InfiniteTable<T>
          {...props}
          tbodyRef={tbodyRef}
          handleOnScroll={handleOnScroll}
        />
      ),
      u1: (
        <U1InfiniteTable<T>
          {...props}
          tbodyRef={tbodyRef}
          handleOnScroll={handleOnScroll}
        />
      ),
      u5: (
        <U5InfiniteTable<T>
          {...props}
          tbodyRef={tbodyRef}
          handleOnScroll={handleOnScroll}
        />
      ),
      u6: (
        <U6InfiniteTable<T>
          {...props}
          tbodyRef={tbodyRef}
          handleOnScroll={handleOnScroll}
        />
      ),
      u7: (
        <U7InfiniteTable<T>
          {...props}
          tbodyRef={tbodyRef}
          handleOnScroll={handleOnScroll}
        />
      ),
    },
    <U5InfiniteTable<T>
      {...props}
      tbodyRef={tbodyRef}
      handleOnScroll={handleOnScroll}
    />
  );
};
