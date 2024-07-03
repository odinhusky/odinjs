import React, {RefObject, useEffect, useRef} from "react";
import {renderByUVersion} from "../../utils/renderByUVersion";
import { default as U5InfiniteHorizontalTable } from './env/u5'
import { default as U7InfiniteHorizontalTable } from './env/u7'

export type TInfiniteHorizontalTableRow<T> = {
  className?: string;
  title: string;
  dataIndex: keyof T
  render?: (record: T) => React.ReactNode | string
}

export interface IInfiniteHorizontalTableProps<T> {
  rowClassName?: string
  headerClassName?: string
  bodyClassName?: string
  columnKey: keyof T;
  className?: string;
  datasource: T[];
  rows: TInfiniteHorizontalTableRow<T>[]
  fetchData?: () => void
  totalCount: number
  isSuccess?: boolean
}

export interface IUVersionInfiniteHorizontalTableProps<T> extends IInfiniteHorizontalTableProps<T> {
  tbodyRef: RefObject<HTMLTableSectionElement>;
  handleOnScroll: (e: React.UIEvent<HTMLTableSectionElement>) => void
}

export const InfiniteHorizontalTable = <T,>(props: IInfiniteHorizontalTableProps<T>) => {
  const tbodyRef = useRef<HTMLTableSectionElement>(null);

  const handleOnScroll = (e: React.UIEvent<HTMLTableSectionElement>) => {
    const bottom = e.currentTarget.scrollWidth - e.currentTarget.scrollLeft - e.currentTarget.clientWidth
    if(bottom < 30) {
      props.fetchData && props.fetchData()
    }
  }

  useEffect(()=> {
    if (tbodyRef.current?.scrollWidth !== undefined) {
      const scrollbarVisible = tbodyRef.current.scrollWidth > tbodyRef.current.clientWidth

      if(!scrollbarVisible && (Number(props.totalCount) - Number(props.datasource.length)) > 30){
        props.fetchData && props.fetchData()
      }
    }
  }, [props.datasource])


  return renderByUVersion({
    "u5": (
      <U5InfiniteHorizontalTable
        {...props}
        tbodyRef={tbodyRef}
        handleOnScroll={handleOnScroll}
      />
    ),
    "u7": (
      <U7InfiniteHorizontalTable
        {...props}
        tbodyRef={tbodyRef}
        handleOnScroll={handleOnScroll}
      />
    )
  },
    <U5InfiniteHorizontalTable
      {...props}
      tbodyRef={tbodyRef}
      handleOnScroll={handleOnScroll}
    />
  )

}