import {PageContainer} from "../../../../../../components-bs/PageContainer";
import {usePageNavigate} from "../../../../../../router/hooks/usePageNavigate";
import {BackNavigation} from "../../../../../../components-bs/BackNavigation/BackNavigation";
import {TActivityRecordItem, useActivityRecord} from "../../../../hooks/useActivityRecord";
import { recordStatusMap } from "../RecordPage";
import Select, { StylesConfig } from "react-select";
import {InfiniteTable, TInfiniteTableColumn} from "../../../../../../components-bs/InfiniteTable";
import { useState } from "react";

interface DesktopRecordPageProps {
  handleStyle: (judge: boolean) => StylesConfig;
}

export const DesktopRecordPage = ({ handleStyle }: DesktopRecordPageProps) => {
  const { onClickToActivity } = usePageNavigate();

  const { activityRecordState, useQueryByActivityOptionAndDayOption } = useActivityRecord();

  const [isMenuOpen1, setIsMenuOpen1] = useState(false);
  const [isMenuOpen2, setIsMenuOpen2] = useState(false);

  const columns: TInfiniteTableColumn<TActivityRecordItem>[] = [
    { title: 'Tempo', dataIndex: 'time'},
    { title: 'Nomes do evento', dataIndex: 'name'},
    { title: 'Valor do bônus', dataIndex: 'bonus', render: (record: any) => <div>{record.bonus}</div>},
    { title: 'Estado', dataIndex: 'status', render: (record: any) => <div style={{
        color: recordStatusMap[record.status ? 'true': 'false'].color
      }}>{recordStatusMap[record.status ? 'true': 'false'].title}</div>},
    { title: 'IP', dataIndex: 'ip'},
  ]

  return (
    <PageContainer
      className='text-white'
    >
      <BackNavigation
        onClick={onClickToActivity}
      />

      <div
        className='rounded-lg bg-[var(--grayscale-20)] p-8 mt-8'
      >
        <div
          className='flex justify-between items-center'
        >
          <div className='flex gap-8'>
            <Select
              className='w-[240px]'
              isSearchable={false}
              value={activityRecordState?.currentDay}
              options={activityRecordState?.dayOptions}
              styles={handleStyle(isMenuOpen1)}
              onMenuOpen={() => setIsMenuOpen1(true)} 
              onMenuClose={() => setIsMenuOpen1(false)}
              onChange={(item: any) => {
                useQueryByActivityOptionAndDayOption(activityRecordState?.currentTypeName || {
                  label: '',
                  value: '',
                  type: ''
                }, item)
              }}
            />

            <Select
              className='w-[240px]'
              isSearchable={false}
              value={activityRecordState?.currentTypeName}
              options={activityRecordState?.activityOptions}
              styles={handleStyle(isMenuOpen2)}
              onMenuOpen={() => setIsMenuOpen2(true)} 
              onMenuClose={() => setIsMenuOpen2(false)}
              onChange={(item: any) => {
                useQueryByActivityOptionAndDayOption(item, activityRecordState?.currentDay || {label: '', value: 1})
              }}
            />
          </div>

          <div className='text-lg font-extrabold text-[var(--grayscale-100)]'>
            Bônus{' '}
            <span className='text-[var(--state-success-main)]'>{activityRecordState?.totalBonus}</span>
          </div>
        </div>


        <InfiniteTable<TActivityRecordItem>
          className='mt-8 h-[400px]'
          headerClassName='bg-linear-4-disabled'
          rowKey='time'
          datasource={activityRecordState?.tableBody || []}
          columns={columns}
          totalCount={activityRecordState?.tableBody.length || 0}
        />

        
      </div>
    </PageContainer>
  )
}