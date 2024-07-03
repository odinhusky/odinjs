import {PageContainer} from "../../../../../../components-bs/PageContainer";
import {BackNavigation} from "../../../../../../components-bs/BackNavigation/BackNavigation";
import {usePageNavigate} from "../../../../../../router/hooks/usePageNavigate";
import {useActivityRecord} from "../../../../hooks/useActivityRecord";
import {Table} from "../../../../../../components-bs/Table";
import {recordStatusMap} from "../RecordPage";
import Select, {StylesConfig} from "react-select";
import cx from "classnames";

const selectStyleProps: StylesConfig = {
  control: (base, { isFocused }) => (
    {
      ...base,
      background: 'var(--primary-variant)',
      borderColor: isFocused? 'var(--primary-assistant)': 'rgba(255,255,255,.3)',
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

  option: (base, { isFocused }) => ({
    ...base,
    background: isFocused ? 'rgba(255,255,255, .2)': 'var(--primary-variant)',
    color: 'white',
    '&:active': {
      background: "rgba(0, 0, 0, .3)"
    },
  }),

  menu: (base) => ({
    ...base,
    borderRadius: '8px',
    background: 'var(--primary-variant)',
    border: 'rgba(255,255,255,.3) solid 1px',
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
  const { onClickToActivity} = usePageNavigate()
  const { activityRecordState, useQueryByActivityOptionAndDayOption}= useActivityRecord()

  const columns = [
    { title: 'Tempo', name: 'time', key:'time'},
    { title: 'Nomes do evento', name: 'name', key:'name'},
    { title: 'Valor do bônus', name: 'bonus', key:'bonus', render: (record: any) => <div className='text-[var(--secondary-assistant)]'>{record.bonus}</div>},
    { title: 'Estado', name: 'status', key:'status', render: (record: any) => <div style={{
      color: recordStatusMap[record.status ? 'true': 'false'].color
      }}>{recordStatusMap[record.status ? 'true': 'false'].title}</div>},
    { title: 'IP', name: 'ip', key:'ip'},
  ]

  return (
    <PageContainer
      className='text-white'
    >
      <BackNavigation onClick={onClickToActivity} />
      <div className='font-bold text-2xl mt-8'>Reg de Coletas</div>

      <div className='flex justify-between mt-8'>
        <div className='flex gap-4'>
          <Select
            className='w-[280px]'
            isSearchable={false}
            value={activityRecordState?.currentDay}
            options={activityRecordState?.dayOptions}
            onChange={(item: any) => {
              useQueryByActivityOptionAndDayOption(activityRecordState?.currentTypeName || { label: '', value: '', type: ''}, item)
            }}
            styles={selectStyleProps}
          />
          <Select
            className='w-[280px]'
            isSearchable={false}
            value={activityRecordState?.currentTypeName}
            options={activityRecordState?.activityOptions}
            onChange={(item: any) => {
              useQueryByActivityOptionAndDayOption(item, activityRecordState?.currentDay || { label: '', value: 1})
            }}
            styles={selectStyleProps}
          />
        </div>
        <div className='text-base font-bold'>Bônus <span className='text-[var(--state-info-main)]'>{activityRecordState?.totalBonus}</span></div>
      </div>

      <div
        className= {cx(
            'mt-8 rounded-lg overflow-hidden',
            {'min-h-[80vh] h-[80vh]' : activityRecordState?.tableBody.length > 10}
        )}
      >
        <Table
          dataSource={activityRecordState?.tableBody || []}
          columns={columns}
          dataCount={activityRecordState?.tableBody.length || 0}
        />
      </div>
    </PageContainer>
  )
}