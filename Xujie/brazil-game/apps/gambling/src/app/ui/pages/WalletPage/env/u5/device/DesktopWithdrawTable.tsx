import { useEffect, useState } from "react";
import { GetWithdrawRecordResponseData } from "../../../../../../external/PaymentEndpoint";
import { useWithdrawHistoryListMutation } from "../../../../../../external";
import { notification } from "antd";
import { InfiniteTable, TInfiniteTableColumn } from "../../../../../components-bs/InfiniteTable";
import { environment } from "../../../../../../../environments/environment";
import { formatLocaleMoney } from "../../../../../utils/format";
import { WithdrawStatusMap } from "../RecordPanel";
import {appCopy} from "../../../../../utils/appCopy";


export const DesktopWithdrawTable = () => {
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

  const columns: TInfiniteTableColumn<GetWithdrawRecordResponseData>[] = [
    {
      dataIndex: 'pay_serial_no',
      title: 'Identificador',
      className: 'min-w-[250px]',
      render: record => (
        <div className='flex gap-2'>
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
    { dataIndex: 'created_at', title: 'Tempo'},
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
    <div className='mt-8'>
      {contextHolder}
      <InfiniteTable
        className='text-sm h-[400px]'
        rowKey='pay_serial_no'
        datasource={records}
        columns={columns}
        fetchData={handleFetchData}
        totalCount={withdrawRecordData?.page.count || 0}
        isSuccess={isSuccess}
        />
    </div>
  )
}
