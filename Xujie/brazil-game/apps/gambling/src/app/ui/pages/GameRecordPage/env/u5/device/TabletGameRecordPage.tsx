import { DatePicker } from 'antd';
import { IGameRecordPageProps } from "../../../index";
import { BackNavigation } from "../../../../../components-bs/BackNavigation/BackNavigation";
import { usePageNavigate } from "../../../../../router/hooks/usePageNavigate";
import moment, { Moment } from "moment";
import { formatLocaleMoney } from "../../../../../utils/format";
import { PageContainer } from "../../../../../components-bs/PageContainer";
import { InfiniteTable, TInfiniteTableColumn } from "../../../../../components-bs/InfiniteTable";
import { GetUserGameRecordResponse } from '../../../../../../external';

const { RangePicker } = DatePicker;

const datePickerStyle = {
  width: '242px',
  height: '40px',
  color: 'white',
  fontSize: '14px',
  fontWeight: '700px',
  backgroundColor: 'var(--grayscale-30)',
  border: 'none',
  borderRadius: '100px',
  display: 'flex',
  alignItems: 'center',
};

type TGameRecordItem = Pick<GetUserGameRecordResponse['rows'][0], 'gameName' | 'createTime' | 'bet' | 'win'>

export const TabletGameRecordPage = ({
  dates,
  setDates,
  records,
  dataCount,
  handleFetchData,
}: IGameRecordPageProps) => {

  const max = moment();

  const { onClickToIndex } = usePageNavigate();

  const columns: TInfiniteTableColumn<TGameRecordItem>[] = [
    {
      title: 'Nome do jogo',
      dataIndex: 'gameName',
      render: (record: any) => (
        <div className='flex items-center'>
          <div>
            {record.gameName}
          </div>
        </div>
      )
    },
    {
      title: 'Tempo',
      dataIndex: 'createTime',
      render: (record: any) => (
        <>
          <div>{moment(record.createTime).format('DD.MM.YYYY HH:mm:ss')}</div>
        </>
      )
    },
    { title: 'Valor Da Aposta', dataIndex: 'bet', render: (record: any) => `R$ ${formatLocaleMoney(record.bet / 100)}` },
    { title: 'Lucro', dataIndex: 'win', render: (record: any) => formatLocaleMoney(record.win / 100) }
  ]

  return (
    <PageContainer className='flex flex-col h-full'>
      <BackNavigation onClick={onClickToIndex} />
      <div className='p-8 mt-8 rounded-lg box-border bg-[var(--grayscale-20)]'>
        <div className='text-sm mb-8 font-bold flex justify-center'>
          <RangePicker
            value={[dates[0], dates[1]]}
            allowClear={false}
            format="YYYY-MM-DD"
            separator={'-'}
            onChange={(dates) => {
              if (dates) {
                setDates(dates as Moment[]);
              }
            }}
            suffixIcon={false}
            className="before:translate-y-0.5 before:mr-2 before:content-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADkSURBVHgBrZWNDYIwEIWvTIAb1A3cxG5QNtANYAMcQSdgFEaoG+gG552p4UfoXQlf8mjSvHsh16MALICIJakidaSAA33c86CFzI70QpkgBpPhhvk0a2ENbqedh1VCwYV0FTyOs0wMDLTYRDds9IaE5006Fvx2QpiWknQu+AH74TjQwn6cDHdTYbQg9/BLAToOxpgnrQ/RidNPaw322Oi/J3w9GzrUERShnWaoc0L972bRXAaT0Fg32R/30WEeAf9b5eeH0+J26rUTrzGfVhqjCnWjxH13oAWHX0A/Cglxz5PKpboPs8FL0YwrZ74AAAAASUVORK5CYII=')]"
            style={datePickerStyle}
            disabledDate={(current) => current > max}
          />
        </div>

        <div className='w-full rounded-lg text-white text-center bg-[var(--grayscale-15)]'>
          <InfiniteTable<TGameRecordItem>
            className='mt-8 h-[600px]'
            headerClassName='bg-linear-2-dark-active'
            rowKey='createTime'
            datasource={records || []}
            columns={columns}
            totalCount={dataCount || 0}
            fetchData={handleFetchData}
          />
        </div>
      </div>
    </PageContainer>
  )
}
