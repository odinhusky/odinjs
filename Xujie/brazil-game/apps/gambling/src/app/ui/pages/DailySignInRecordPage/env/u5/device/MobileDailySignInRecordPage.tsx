import {PageContainer} from "../../../../../components-bs/PageContainer";
import {useDailySignInRecordPage} from "../hook/useDailySignInRecordPage";
import {useGetSignInRecordMutation} from "../../../../../../external";
import {useEffect, useState} from "react";
import {GetSignInRecordResponseData} from "../../../../../../external/endpoint/signin/GetSignInEndpoint";
import {TInfiniteTableColumn} from "../../../../../components-bs/InfiniteTable";
import {formatLocaleMoney} from "../../../../../utils/format";
import {AppLocalStorage} from "../../../../../../persistant/localstorage";
import {AppLocalStorageKey} from "../../../../../../persistant/AppLocalStorageKey";
import {
  InfiniteHorizontalTable,
  TInfiniteHorizontalTableRow
} from "../../../../../components-bs/InfiniteHorizontalTable";
import {usePageNavigate} from "../../../../../router/hooks/usePageNavigate";
import {BackNavigation} from "../../../../../components-bs/BackNavigation/BackNavigation";


export const MobileDailySignInRecordPage =() => {
  const { onClickToCheckInDaily } = usePageNavigate();


  const [triggerGetSignInRecord, { data }] = useGetSignInRecordMutation();
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<GetSignInRecordResponseData[]>([])

  const rows: TInfiniteHorizontalTableRow<GetSignInRecordResponseData>[] = [
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


  return (
    <PageContainer
      className='text-white'
    >
      <BackNavigation
        onClick={onClickToCheckInDaily}
      />

      <div
          style={{
            scrollbarColor: 'var(--grayscale-60)  var(--grayscale-30)',
            scrollbarWidth:'thin'
          }}>
        <InfiniteHorizontalTable
            className='text-xs rounded-lg mt-4'
            headerClassName='text-xs px-3 font-bold w-[150px] h-10 bg-linear-5-disabled'
            rowClassName='h-10'
            bodyClassName='bg-[var(--grayscale-15)]'
            columnKey='created_at'
            datasource={records}
            rows={rows}
            fetchData={handleFetchData}
            totalCount={data?.page.count || 0}
        />
      </div>
    </PageContainer>
  )
}