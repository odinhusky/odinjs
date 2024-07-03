import {PageContainer} from "../../../../../components-bs/PageContainer";
import {usePageNavigate} from "../../../../../router/hooks/usePageNavigate";
import {BackNavigation} from "../../../../../components-bs/BackNavigation/BackNavigation";
import {useDailySignInRecordPage} from "../hook/useDailySignInRecordPage";
import {InfiniteTable} from "../../../../../components-bs/InfiniteTable";


export const DesktopDailySignInRecordPage = () => {
  const { onClickToCheckInDaily } = usePageNavigate();

  const {
    handleFetchData,
    columns,
    records,
    dataTotal
  } = useDailySignInRecordPage()

  return (
    <PageContainer
      className='text-white'
    >
      <BackNavigation
        onClick={onClickToCheckInDaily}
      />

      <div>
        <InfiniteTable
            className='text-sm mt-8 h-[400px]'
            rowKey='created_at'
            datasource={records}
            columns={columns}
            fetchData={handleFetchData}
            totalCount={dataTotal}
        />
      </div>

    </PageContainer>
  )
}