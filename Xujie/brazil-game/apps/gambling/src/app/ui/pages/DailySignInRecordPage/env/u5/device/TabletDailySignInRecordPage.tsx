import {PageContainer} from "../../../../../components-bs/PageContainer";
import {usePageNavigate} from "../../../../../router/hooks/usePageNavigate";
import {useDailySignInRecordPage} from "../hook/useDailySignInRecordPage";
import {BackNavigation} from "../../../../../components-bs/BackNavigation/BackNavigation";
import {InfiniteTable} from "../../../../../components-bs/InfiniteTable";
import {environment} from "../../../../../../../environments/environment";


export const TabletDailySignInRecordPage = () => {
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

      <div
          style={{
            scrollbarColor: 'var(--grayscale-60)  var(--grayscale-30)',
            scrollbarWidth:'thin'
          }}
          className="mt-5 p-4 rounded-lg bg-[var(--grayscale-20)] ">
        <InfiniteTable
          className='text-xs h-[400px]'
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