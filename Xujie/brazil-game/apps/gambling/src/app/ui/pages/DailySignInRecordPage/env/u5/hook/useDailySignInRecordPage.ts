import {formatLocaleMoney} from "../../../../../utils/format";
import {TInfiniteTableColumn} from "../../../../../components-bs/InfiniteTable";
import {GetSignInRecordResponseData} from "../../../../../../external/endpoint/signin/GetSignInEndpoint";
import {useGetSignInRecordMutation} from "../../../../../../external";
import {useEffect, useState} from "react";
import {AppLocalStorage} from "../../../../../../persistant/localstorage";
import {AppLocalStorageKey} from "../../../../../../persistant/AppLocalStorageKey";


export const useDailySignInRecordPage = () => {

  const [triggerGetSignInRecord, { data }] = useGetSignInRecordMutation();
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<GetSignInRecordResponseData[]>([])

  const columns: TInfiniteTableColumn<GetSignInRecordResponseData>[] = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Nivel VIP', dataIndex:'vip_level', render: (record) => `LV${record.vip_level}`  },
    { title: 'Coleta Contínua', dataIndex: 'days', render: (record) => record.days === 1 ? `${record.days}dia` : `${record.days}dias` },
    { title: 'Recompensas', dataIndex: 'cashback', render: (record) => `R$ ${formatLocaleMoney(record.cashback / 100)}` },
    { title: 'Tempo', dataIndex: 'created_at' },
  ]

  const handleFetchData = () => {
    if (page < (data?.page?.page_count || 0)) {
      setPage(page + 1)
    }
  }

  useEffect(() => {
    triggerGetSignInRecord({
      limit: 10,
      page: page,
      token: AppLocalStorage.getItem(AppLocalStorageKey.token) || "",
    })
  }, [page])

  useEffect(() => {
    setRecords([...records, ...(data?.data || [])])

  }, [data?.data])

  return {
    handleFetchData,
    columns,
    records,
    dataTotal: data?.page?.count || 0
  }
}