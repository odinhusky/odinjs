import {useEffect, useState} from "react";
import {GetRechargeRecordResponseData} from "../../../../../../external/PaymentEndpoint";
import {notification} from "antd";
import {useRechargeHistoryListMutation} from "../../../../../../external";
import {
  InfiniteHorizontalTable,
  TInfiniteHorizontalTableRow
} from "../../../../../components-bs/InfiniteHorizontalTable";
import {environment} from "../../../../../../../environments/environment";
import {formatLocaleMoney} from "../../../../../utils/format";
import {DepositStatusMap} from "../RecordPanel";
import {appCopy} from "../../../../../utils/appCopy";


export const MobileDepositTable = () => {
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<GetRechargeRecordResponseData[]>([])
  const [notice, contextHolder] = notification.useNotification()

  const [triggerGetDepositRecord, { data: depositRecordData, isSuccess }] = useRechargeHistoryListMutation({});

  const onClickToCopy = (copyText: string) => {
    appCopy(copyText || '');
    notice.success({
      message: "Copiado!"
    })
  }

  const handleFetchData = () => {
    if(depositRecordData !== undefined) {
      if(page < depositRecordData.page.page_count) {
        setPage(i => i + 1)
      }
    }
  }

  const rows: TInfiniteHorizontalTableRow<GetRechargeRecordResponseData>[] = [
    {
      title: 'Identificador',
      dataIndex: 'pay_serial_no',
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
    { title: 'Valor', dataIndex: 'amount', render: record => `R$ ${formatLocaleMoney(Number(record.amount))}`},
    { title: 'Bônus', dataIndex: 'rate', render: record => `R$ ${(formatLocaleMoney(Number(record.amount) * Number(record.rate)))}`},
    { title: 'Método De Depósito', dataIndex: 'pay_channel'},
    { title: 'Estado Do Depósito', dataIndex: 'status', render: record => <div style={{ color: DepositStatusMap[record.status].color}}>{DepositStatusMap[record.status].title}</div>},
    { title: 'Tempo', dataIndex: 'created_at'},
  ]


  useEffect(() => {
    triggerGetDepositRecord({
      limit: 10,
      page: page
    })
  }, [page]);

  useEffect(() => {
    if (depositRecordData !== undefined) {
      setRecords(i => [...i, ...depositRecordData.data])
    }

  }, [depositRecordData?.data])

  return (
    <>
      {contextHolder}
      <InfiniteHorizontalTable<GetRechargeRecordResponseData>
        columnKey='pay_serial_no'
        className='text-xs rounded-lg'
        headerClassName='text-xs px-3 font-bold w-[96px] h-12 bg-linear-5-disabled'
        rowClassName='h-12'
        bodyClassName='bg-[var(--grayscale-15)]'
        datasource={records}
        rows={rows}
        fetchData={handleFetchData}
        totalCount={depositRecordData?.page.count || 0}
        isSuccess={isSuccess}
      />
    </>
  )
}
