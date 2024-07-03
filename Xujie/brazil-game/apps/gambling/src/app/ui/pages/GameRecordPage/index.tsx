import moment from 'moment';
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { GetUserGameRecordResponse, useLazyGetUserGameRecordQuery } from "../../../external";
import { AppLocalStorage } from '../../../persistant/localstorage';
import { useAllowLoginRouterRules } from "../../router/hooks/useAllowLoginRouterRules";
import { AppLocalStorageKey } from "../../../persistant/AppLocalStorageKey";
import { GameRecordPage as CocoGameRecordPage } from './env/u1';
import { GameRecordPage as RioGameRecordPage } from './env/u2';
import { GameRecordPage as U5GameRecordPage } from './env/u5';
import { GameRecordPage as PGameRecordPage } from './env/p1';
import { GameRecordPage as U6GameRecordPage } from './env/u6';
import { GameRecordPage as U7GameRecordPage } from './env/u7';
import { renderByUVersion } from "../../utils/renderByUVersion";
import { IUserInfo } from "../../../persistant/IUserInfo";
import { environment } from 'apps/gambling/src/environments/environment';
import { U6 } from '../../constant';
import { useTablePagination } from '../../components-bs/Table/env/u6/useTablePagination';
import useBreakpoint from '../../pageTemplate/hooks/useBreakpoint';

export interface IGameRecordPageProps {
  dates: moment.Moment[]
  setDates: Dispatch<SetStateAction<moment.Moment[]>>
  handleFetchData: () => void
  records: GetUserGameRecordResponse['rows']
  dataCount: number
  currentPage?: number
  pageSize?: number
  pages?: number
  onPrevPage?: () => void
  onNextPage?: () => void
}

export const GameRecordPage = () => {
  useAllowLoginRouterRules();

  const { isMobile } = useBreakpoint();

  const pageSize = 10
  const startDate = moment().subtract(7, 'days');
  const endDate = moment();
  const dateFormat = 'YYYYMMDD';
  const [dates, setDates] = useState([startDate, endDate]);


  const [triggerGetRecord, { data }] = useLazyGetUserGameRecordQuery();
  const [resetRecords, setResetRecords] = useState(false);
  const [records, setRecords] = useState<GetUserGameRecordResponse["rows"]>([])
  const [page, setPage] = useState(1)

  const { currentPage, goToPrevPage, goToNextPage, goToFirstPage } = useTablePagination({ dataCount: data?.data.total || 0 })

  const user: IUserInfo = AppLocalStorage.getItem(AppLocalStorageKey.userInfo) ? JSON.parse(AppLocalStorage.getItem(AppLocalStorageKey.userInfo) || "") : {};

  const handleFetchData = () => {
    if (records.length < (data?.data.total || 0)) {
      setPage((Math.ceil(records.length / pageSize)) + 1)
    }
  }

  const pages = Math.ceil(data?.data.total! / pageSize)
  const onDateChange:typeof setDates = (value)=>{
    goToFirstPage()
    setDates(value)
  }
  const onPrevPage = () => {
    if (currentPage < 1) return;
    goToPrevPage()
  }

  const onNextPage = () => {
    if (currentPage >= pages) return;
    goToNextPage()
  }

  const getData = (page: number) => {
    triggerGetRecord({
      userId: user.user_id,
      dayMin: dates[0].format(dateFormat),
      dayMax: dates[1].format(dateFormat),
      pageNum: page,
      pageSize: pageSize,
    });
  }

  useEffect(() => {
    getData(currentPage)
  }, [currentPage])

  useEffect(() => {
    getData(page)
  }, [page, dates]);

  useEffect(() => {
    setResetRecords(true)
    setPage(1)
  }, [dates])


  useEffect(() => {
    if (resetRecords) {
      setRecords(data?.data.records || [])
      setResetRecords(false)
    } else {
      if (environment.uVersion == U6 && !isMobile) {
        setRecords(data?.data.records || [])
      } else {
        setRecords([...records, ...(data?.data.records || [])])
      }
    }
  }, [data?.data.records])


  useEffect(() => {
    if (!isMobile) {
      goToFirstPage()
    } else {
      setRecords((data?.data.records || []).slice(0, pageSize))
    }
    setResetRecords(true)
    setPage(1)
  }, [isMobile])


  return renderByUVersion({
    "p1": (
      <PGameRecordPage
        dates={dates}
        setDates={onDateChange}
        handleFetchData={handleFetchData}
        records={records}
        dataCount={data?.data.total || 0}
      />
    ),
    "u1": (
      <CocoGameRecordPage
        dates={dates}
        setDates={onDateChange}
        handleFetchData={handleFetchData}
        records={records}
        dataCount={data?.data.total || 0}
      />
    ),
    "u2": (
      <RioGameRecordPage
        dates={dates}
        setDates={onDateChange}
        handleFetchData={handleFetchData}
        records={records}
        dataCount={data?.data.total || 0}
      />
    ),
    "u5": (
      <U5GameRecordPage
        dates={dates}
        setDates={onDateChange}
        handleFetchData={handleFetchData}
        records={records}
        dataCount={data?.data.total || 0}
      />
    ),
    "u6": (
      <U6GameRecordPage
        dates={dates}
        setDates={onDateChange}
        handleFetchData={handleFetchData}
        records={records}
        currentPage={currentPage}
        pageSize={pageSize}
        pages={pages}
        dataCount={data?.data.total || 0}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
      />
    ),
    "u7": (
      <U7GameRecordPage
        dates={dates}
        setDates={onDateChange}
        handleFetchData={handleFetchData}
        records={records}
        currentPage={currentPage}
        pageSize={pageSize}
        pages={pages}
        dataCount={data?.data.total || 0}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
      />
    )
  }, (
    <CocoGameRecordPage
      dates={dates}
      setDates={onDateChange}
      handleFetchData={handleFetchData}
      records={records}
      dataCount={data?.data.total || 0}
    />
  ))
};
