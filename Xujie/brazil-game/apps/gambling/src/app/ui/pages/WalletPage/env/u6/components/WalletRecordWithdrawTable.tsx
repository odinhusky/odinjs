import { useWithdrawHistoryListMutation } from "apps/gambling/src/app/external";
import { GetWithdrawRecordResponseData } from "apps/gambling/src/app/external/PaymentEndpoint";
import { InfiniteTable, TInfiniteTableColumn } from "apps/gambling/src/app/ui/components-bs/InfiniteTable";
import cx from "apps/gambling/src/app/ui/utils/cx";
import { formatLocaleMoney } from "apps/gambling/src/app/ui/utils/format";
import { environment } from "apps/gambling/src/environments/environment";
import { useEffect, useState } from "react";
import { WithdrawStatusMap } from "../RecordPanel";
import useBreakpoint from "apps/gambling/src/app/ui/pageTemplate/hooks/useBreakpoint";
import WalletRecordWithdrawMobileTable from "./WalletRecordWithdrawMobileTable";
import useCopy from "apps/gambling/src/app/ui/hooks/useCopy";
import WalletRecordTableControl from "./WalletRecordTableControl";
import t from "apps/gambling/src/assets/constant/lang";

interface WalletRecordWithdrawTableProps {

}

export const WalletRecordWithdrawTable = ({}: WalletRecordWithdrawTableProps) => {

  // # states
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [records, setRecords] = useState<GetWithdrawRecordResponseData[]>([]);

  // * hooks
  const {copy, contextHolder} = useCopy();
  const {isDesktop, isTablet, isMobile} = useBreakpoint();

  // # API data
  const [triggerGetDepositRecord, { data: withdrawRecordData, isSuccess }] = useWithdrawHistoryListMutation({});

  useEffect(() => {

    if(isMobile) {
      // 如果是 mobile 就取全部的資料
      triggerGetDepositRecord({
        limit: 100000000,
        page: 1,
      })
    } else {
      triggerGetDepositRecord({
        limit: 10,
        page: page,
      })
    }
  }, [page, isMobile]);

  useEffect(() => {
    if (withdrawRecordData !== undefined) {
      // console.log('@@ withdrawRecordData?.data', withdrawRecordData)
      setTotalPage(withdrawRecordData.page.page_count);
      setRecords([...withdrawRecordData.data]);
    }
  }, [withdrawRecordData?.data])

  // = styles
  const thStyle = cx(
    'bg--linear-3-disabled',
    'text-white text-sm leading-5 font-medium',
    'h-[48px]'
  );

  // & handled data
  const columns: TInfiniteTableColumn<GetWithdrawRecordResponseData>[] = [
    {
      dataIndex: 'pay_serial_no',
      title: t['Identificator'],
      thClassName: thStyle,
      render: record => (
        <div className='flex items-center gap-2'>
          <div className="break-all">{record.pay_serial_no}</div>
          <img
            alt='copy'
            className='h-5 w-5 cursor-pointer'
            onClick={()=> copy(record.pay_serial_no)}
            src={`assets/${environment.uVersion}/icon_copy.png`}
          />
        </div>
      )
    },
    { 
      dataIndex: 'amount',
      title: t['Value'],
      thClassName: thStyle,
      render: record => `R$ ${formatLocaleMoney(Number(record.amount))}`
    },
    { 
      dataIndex: 'fee',
      title: t['withdrawFee'],
      thClassName: thStyle,
      render: record => `R$ ${(formatLocaleMoney(Number(record.amount) * Number(record.fee)))}`
    },
    {
      dataIndex: 'pay_channel',
      title: t['depositMethod'],
      thClassName: thStyle
    },
    {
      dataIndex: 'status',
      title: t['withdrawalStatus'],
      thClassName: thStyle,
      render: record => <div style={{ color: WithdrawStatusMap[record.status].color}}>{WithdrawStatusMap[record.status].title}</div>
    },
    {
      dataIndex: 'created_at',
      title: t['Time'],
      thClassName: thStyle
    },
  ];

  return (
    <>
      {contextHolder}
      {
        (isDesktop || isTablet) ? (
          <>
            <InfiniteTable<GetWithdrawRecordResponseData>
              rowKey='pay_serial_no'
              className={cx(
                'h-auto',
                {'h-[400px]': records.length === 0 }
              )}
              datasource={records}
              columns={columns}
              totalCount={withdrawRecordData?.page.count || 0}
              isSuccess={isSuccess}
            /> 

            <WalletRecordTableControl
              page={page}
              totalPage={totalPage}
              setPage={setPage}
            />
          </>
        ) : null
      }

      {
        isMobile ? (
          <WalletRecordWithdrawMobileTable
            columns={columns}
            datasource={records}
            isSuccess={isSuccess}
          />
        ) : null
      }
    </>
  )
}

export default WalletRecordWithdrawTable;