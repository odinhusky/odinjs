import {useEffect, useState} from "react";
import {GetWithdrawRecordResponseData} from "../../../../../../external/PaymentEndpoint";
import {useWithdrawHistoryListMutation} from "../../../../../../external";
import {notification} from "antd";
import {
  InfiniteHorizontalTable,
  TInfiniteHorizontalTableRow
} from "../../../../../components-bs/InfiniteHorizontalTable";
import {environment} from "../../../../../../../environments/environment";
import {formatLocaleMoney} from "../../../../../utils/format";
import {WithdrawStatusMap} from "../RecordPanel";
import {appCopy} from "../../../../../utils/appCopy";


export const MobileWithdrawTable = () => {
  const [records, setRecords] = useState<GetWithdrawRecordResponseData[]>([])
  const [page, setPage] = useState(1);

  const [triggerGetWithdrawRecord, { data: withdrawRecordData, isSuccess}] = useWithdrawHistoryListMutation()
  const [notice, contextHolder] = notification.useNotification()

  const onClickToCopy = (copyText: string) => {
    appCopy(copyText || '');
    notice.success({
      message: "Copiado!"
    })
  }

  const rows: TInfiniteHorizontalTableRow<GetWithdrawRecordResponseData> [] = [
    {
      dataIndex: 'pay_serial_no',
      title: 'Identificador',
      render: record => (
        <div className='flex items-center gap-1'>
          <div>{record.pay_serial_no}</div>
          <img
            alt='copy'
            className='h-5 w-5 cursor-pointer'
            onClick={()=> onClickToCopy(record.pay_serial_no)}
            src={`assets/${environment.uVersion}/${environment.mVersion}/icon_copy.png`}
          />
        </div>
      )
    },
    { dataIndex: 'amount', title: 'Valor', render: record => `R$ ${formatLocaleMoney(Number(record.amount))}`},
    { dataIndex: 'fee', title: 'Taxa De Retirada', render: record => `R$ ${formatLocaleMoney(Number(record.fee))}`},
    { dataIndex: 'pay_channel', title: 'Método De Retirada'},
    { dataIndex: 'status', title: 'Status De Retirada', render: record => <div style={{ color: WithdrawStatusMap[record.status].color}}>{WithdrawStatusMap[record.status].title}</div>},
    { dataIndex: 'created_at', title: 'Tempo'}
  ]

  const handleFetchData = () => {
    if(withdrawRecordData !== undefined) {
      if (page < withdrawRecordData.page.page_count) {
        setPage(page + 1)
      }
    }
  }

  useEffect(()=>{
    triggerGetWithdrawRecord({
      limit: 10,
      page,
    })
  }, [page])

  useEffect(()=> {
    if (withdrawRecordData !== undefined) {
      setRecords([...records, ...withdrawRecordData.data])
    }
  }, [withdrawRecordData?.data])

  return (
    <>
      {contextHolder}
      <InfiniteHorizontalTable<GetWithdrawRecordResponseData>
        columnKey='pay_serial_no'
        className='text-xs rounded-lg'
        headerClassName='text-xs px-3 font-bold w-[96px] h-12 bg-linear-5-disabled'
        rowClassName='h-12'
        bodyClassName='bg-[var(--grayscale-15)]'
        datasource={records}
        rows={rows}
        fetchData={handleFetchData}
        totalCount={withdrawRecordData?.page.count || 0}
        isSuccess={isSuccess}
      />
    </>
  )
}
