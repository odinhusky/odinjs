import { GetRechargeRecordResponseData } from "../../../../../../external/PaymentEndpoint";
import { useEffect, useState } from "react";
import { InfiniteTable, TInfiniteTableColumn } from "../../../../../components-bs/InfiniteTable";
import { useRechargeHistoryListMutation } from "../../../../../../external";
import { notification } from "antd";
import { environment } from "../../../../../../../environments/environment";
import { formatLocaleMoney } from "../../../../../utils/format";
import { DepositStatusMap } from "../RecordPanel";
import {appCopy} from "../../../../../utils/appCopy";


export const DesktopDepositTable = () => {
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

  const columns: TInfiniteTableColumn<GetRechargeRecordResponseData>[] = [
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
    { dataIndex: 'rate', title: 'Bônus', render: record => `R$ ${(formatLocaleMoney(Number(record.amount) * Number(record.rate)))}`},
    { dataIndex: 'pay_channel', title: 'Método De Depósito'},
    { dataIndex: 'status', title: 'Estado Do Depósito', render: record => <div style={{ color: DepositStatusMap[record.status].color}}>{DepositStatusMap[record.status].title}</div>},
    { dataIndex: 'created_at', title: 'Tempo'},
  ]

  const handleFetchData = () => {
    if(depositRecordData !== undefined) {
      if(page < depositRecordData.page.page_count) {
        setPage(i => i + 1)
      }
    }
  }

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
    <div className='mt-8'>
      {contextHolder}
      <InfiniteTable<GetRechargeRecordResponseData>
        rowKey='pay_serial_no'
        className='text-sm h-[400px]'
        datasource={records}
        columns={columns}
        fetchData={handleFetchData}
        totalCount={depositRecordData?.page.count || 0}
        isSuccess={isSuccess}
      />
    </div>
  )
}
