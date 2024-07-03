import {PageContainer} from "../../../../../../components-bs/PageContainer";
import {usePageNavigate} from "../../../../../../router/hooks/usePageNavigate";
import {BackNavigation} from "../../../../../../components-bs/BackNavigation/BackNavigation";
import {useActivityRecord} from "../../../../hooks/useActivityRecord";
import Select, {StylesConfig} from "react-select";
import {Table} from "../../../../../../components-bs/Table";
import {recordStatusMap} from "../RecordPage";
import cx from "classnames";

const selectStyleProps: StylesConfig = {
  control: (base, { isFocused }) => (
    {
      ...base,
      background: 'var(--grayscale-20)',
      border: isFocused? '2px solid var(--primary-main)': '1px solid var(--grayscale-50)',
      color: 'white',
      padding: '0px 8px',
      borderRadius: '8px',
      outline: 'none',
      boxShadow: 'none',
      '&:hover': {
      },
    }
  ),
  valueContainer: (style) => ({
    ...style,
    color: 'white',
  }),

  indicatorSeparator: (provided) => ({
    ...provided,
    display: 'none',
  }),

  option: (base, { isFocused, isSelected }) => ({
    ...base,
    background: isSelected ? 'var(--grayscale-30)': isFocused ? 'var(--grayscale-50)': 'var(--grayscale-20)',
    color: 'white',
    '&:active': {
      background: "rgba(0, 0, 0, .3)"
    },
  }),

  menu: (base) => ({
    ...base,
    borderRadius: '8px',
  }),
  menuList: (base) => ({
    ...base,
    borderRadius: '8px',
    padding: '0px'
  }),

  singleValue: (provided: any, state: any) => ({
    ...provided,
    color: 'white'
  }),
}


export const DesktopRecordPage = () => {
  const { onClickToActivity } = usePageNavigate()

  const { activityRecordState, useQueryByActivityOptionAndDayOption } = useActivityRecord()

  const columns = [
    { title: 'Tempo', name: 'time', key:'time'},
    { title: 'Nomes do evento', name: 'name', key:'name'},
    { title: 'Valor do bônus', name: 'bonus', key:'bonus', render: (record: any) => <div>{record.bonus}</div>},
    { title: 'Estado', name: 'status', key:'status', render: (record: any) => <div style={{
      color: recordStatusMap[record.status ? 'true': 'false'].color
      }}>{recordStatusMap[record.status ? 'true': 'false'].title}</div>},
    { title: 'IP', name: 'ip', key:'ip'},
  ]

  return (
    <PageContainer
      className='text-white'
    >
      <BackNavigation
        onClick={onClickToActivity}
      />

      <div className='flex justify-between mt-5 items-center'>
        <div className='flex gap-5'>
          <Select
            className='w-[240px]'
            isSearchable={false}
            value={activityRecordState?.currentDay}
            options={activityRecordState?.dayOptions}
            styles={selectStyleProps}
            onChange={(item: any) => {
              useQueryByActivityOptionAndDayOption(activityRecordState?.currentTypeName || { label: '', value: '', type: ''}, item)
            }}
          />

          <Select
            className='w-[240px]'
            isSearchable={false}
            value={activityRecordState?.currentTypeName}
            options={activityRecordState?.activityOptions}
            styles={selectStyleProps}
            onChange={(item: any) => {
              useQueryByActivityOptionAndDayOption(item, activityRecordState?.currentDay || { label: '', value: 1})
            }}
          />
        </div>

        <div className='text-lg text-[var(--grayscale-70)]'>
          Bônus{' '}
          <span className='text-[var(--state-success-main)] font-bold'>{activityRecordState?.totalBonus}</span>
        </div>
      </div>

      <div
          className= {cx(
              'mt-5 overflow-hidden bg-[var(--grayscale-20)] rounded-lg p-5',
              {'md:min-h-[60vh] md:h-[60vh] lg:min-h-[80vh] lg:h-[80vh]' : activityRecordState?.tableBody.length > 10}
          )}
      >
        <Table
          titleStyle='text-xs lg:text-sm border-transparent'
          contentStyle='text-xs lg:text-sm !border-x-0 !border-y'
          className='border-r-0'
          dataSource={activityRecordState?.tableBody || []}
          columns={columns}
          dataCount={activityRecordState?.tableBody.length || 0}
        />
      </div>

    </PageContainer>
  )
}